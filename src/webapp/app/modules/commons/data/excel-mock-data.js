/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/20/2017
 */

(function () {
    /**
     * @memberof oplus.commons
     * @ngdoc service
     * @name excelMockData
     * @description
     *
     * ** Used only for development or demo purpose. **
     *
     * It reads mock data from `api-mock/data/mock-database.xlsx`.
     *
     * Excel column format: `?column_name=convertFn`
     * - `?` Indicates this column is filterable
     * - `column_name` Column name
     * - `=` Followed by a convert function
     * - `convertFn` Use this function to generate data
     *
     */
    angular.module('oplus.commons').service('excelMockData', ['$q', 'dataEx', excelMockData]);

    /**
     * Provides mock data for local development.
     * @param $q
     * @param dataEx {dataEx}
     */
    function excelMockData($q, dataEx) {
        this.readWorksheet = readWorksheet;
        this.readWorkbook = readWorkbook;
        this.getSheetColumnMeta = getSheetColumnMeta;

        /**
         * Read excel data file from `api-mock/data/mock-database.xlsx`
         * @returns {promise.<object>} A workbook
         */
        function readWorkbook() {
            var d = $q.defer();
            var url = "api-mock/data/mock-database.xlsx";
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "arraybuffer";
            xhr.onload = function (e) {
                var arraybuffer = xhr.response;
                /* convert data to binary string */
                var data = new Uint8Array(arraybuffer);
                var arr = new Array();
                for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                var bstr = arr.join("");
                /* Call XLSX */
                var workbook = XLSX.read(bstr, {type: "binary"});
                d.resolve(workbook);
            };
            xhr.send();
            return d.promise;
        }

        /**
         * ?ColumnNameWithoutSpace=jsConvertFn
         * ?: can this column be queried
         * @param column
         * @returns {*}
         */
        function parseColumnDef(column) {
            var attr;
            var matches = column.match(/(\??)([^=]*)(=?)(.*)/);
            if (matches) {
                attr = {
                    oldName: column,
                    canQuery: !!matches[1],
                    newName: matches[2],
                    convertFn: matches[3] && matches[4] ? ('js:' + matches[4]) : undefined
                };
            }
            return attr;
        }

        function getColumnDefs(records) {
            var columns = Object.keys(records[0]);
            var defs = [];
            columns.forEach(function (column) {
                var def = parseColumnDef(column);
                if (def)
                    defs.push(def);
            });
            return defs;
        }

        function convertData(records, defs) {
            // console.log('converters', converters);
            if (defs.length > 0) {
                records.forEach(function (record, index) {
                    defs.forEach(function (def) {
                        if (def.convertFn) {
                            var fn = def.convertFn.replace('$index', index + '');
                            record[def.newName] = dataEx.evalVarExpr(fn, record);
                        }
                        else if (def.newName !== def.oldName)
                            record[def.newName] = record[def.oldName];
                        if (def.newName !== def.oldName) {
                            // console.log('delete', ct.oldName, ct.newName);
                            delete record[def.oldName];
                        }
                    });
                });
            }
        }

        /**
         *
         * @param {string} sheet
         * @returns {promise} {promise<{fields:[{name:string,type:string}],paramsConfig:{param_name:{defaultValue:string,required:boolean}}}>}
         */
        function getSheetColumnMeta(sheet) {
            var d = $q.defer();
            readWorkbook().then(function (workbook) {
                var fields = [], paramsConfig = {};
                var records = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {raw: true});
                var one = records[0];
                if (one) {
                    Object.keys(one).forEach(function (column) {
                        var def = parseColumnDef(column);
                        var field = {name: column, type: typeof one[column]};
                        if (def) {
                            field.name = def.newName;
                        }
                        if (def.canQuery) {
                            paramsConfig[field.name] = {required: false};
                        }
                        fields.push(field);
                    });
                }
                var meta = {fields: fields, paramsConfig: paramsConfig};
                // console.log(meta);
                d.resolve(meta);
            }).catch(function (err) {
                throw err;
            });
            return d.promise;
        }

        /**
         * Reads excel sheet and returns JSON array.
         * @param sheet {string} Sheet name
         * @param params {object=} Query parameters
         * @returns {promise.<{total:number,records:{}}>}
         */
        function readWorksheet(sheet, params) {
            var d = $q.defer();
            params = params || {};
            var records;
            readWorkbook().then(function (workbook) {
                var all = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {raw: true});
                if (all.length === 0) {
                    records = all;
                } else {
                    var defs = getColumnDefs(all);
                    // console.log('defs', defs);
                    convertData(all, defs);
                    var fieldsCanQuery;
                    fieldsCanQuery = _.map(_.filter(defs, {canQuery: true}), 'newName');
                    // console.log('fieldsCanQuery', fieldsCanQuery);
                    if (fieldsCanQuery.length === 0) {
                        records = all;
                    } else {
                        records = _.filter(all, function (record) {
                            // match one parameter is OK...just for test
                            var matched = true;
                            fieldsCanQuery.every(function (field, index) {
                                // if (!params[field]) {
                                //     matched = true;
                                //     return false;
                                // }
                                if (params[field] && (params[field] !== record[field])) {
                                    matched = false;
                                    return false;
                                }
                                return true;
                            });
                            return matched;
                        });
                    }
                }
                d.resolve({
                    total: all.length,
                    records: records
                });
            });
            return d.promise;
        }
    }
})();
