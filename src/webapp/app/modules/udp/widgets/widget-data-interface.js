/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/20/2017
 */

(function () {
    angular.module('oplus.udp').service('widgetDataInterface', widgetDataInterface);

    widgetDataInterface.$inject = ['$q', 'pageService', 'datasetService', 'messageService', 'errorHandler'];

    /**
     * @ngdoc
     * @name widgetDataInterface
     * An adapter/interface between widget and other modules.
     * This service contains and only contains interfaces with external modules.
     * @param $q
     * @param pageService {pageService}
     * @param datasetService {datasetService}
     */
    function widgetDataInterface($q, pageService, datasetService, messageService, errorHandler) {
        // this.findWidgetDatasets = datasetService.findAllDatasets;
        // this.queryDatasetMeta = datasetService.queryDatasetMeta;
        // this.queryDataset = datasetService.queryDataset;
        // this.getDynamicDataset = getDynamicDataset;
        this.findAllPagesInfo = function () {
            return pageService.findAllPages({noContent: true});
        };
        //
        // /**
        //  * 解析组合数据集
        //  * @param config
        //  *
        //  *      joinx: {
        //  *          dses: [
        //  *              // code：数据集的code
        //  *              // relations：本数据集(right)和前数据集(left)的字段关联关系，relation之间是AND的关系
        //  *              // fields: 对该数据集的字段定义（可选），key是字段名，value是`{excluded:true|false, rename:string}`
        //  *              // fields.excluded: 是否将该字段从结果集中排除
        //  *              // fields.rename：字段重命名。如果和前一个数据集有重名字段，而没有定义重命名，该字段将忽略
        //  *              {
        //  *                  code: "dataset_1"
        //  *                  // NOTE：第一个数据集不支持relations，如果有也会被忽略
        //  *              },
        //  *              {
        //  *                  code: "dataset_2",
        //  *                  relations:[{left:"left_field",right:"right_field"}],
        //  *
        //  *                  fields:{"user_id":{excluded:false,rename:'newfield'}}
        //  *              },
        //  *              {
        //  *                  code: "dataset_3",
        //  *                  relations:[{left:"left_field",right:"right_field"},{left:"left_field2",right:"right_field3"}]
        //  *              }
        //  *         ]
        //  *      }
        //  *
        //  *
        //  *
        //  *
        //  */
        // function getDynamicDataset (config,params) {
        //
        //     // 重命名数据集的字段
        //     function renameFields (dataSetList) {
        //         _.forEach(dataSetList,function(data,index){
        //             var fieldsConfig = dses[index].fields;
        //             if (!_.isEmpty(fieldsConfig)) {
        //                 // data.records
        //                 for (var i=0,size= data.records.length;i<size;i++) {
        //                     for (var oldField in fieldsConfig) {
        //                         var newFieldConfig = fieldsConfig[oldField];
        //
        //                         // 当excluded为true时，删除此字段
        //                         if (newFieldConfig.excluded) {
        //                             delete  data.records[i][oldField];
        //                             continue;
        //                         }
        //                         //当excluded为false且rename不为空时，进行重命名
        //                         if (!newFieldConfig.excluded && !_.isEmpty(newFieldConfig.rename)) {
        //                             var value =  data.records[i][oldField];
        //                             var newField = newFieldConfig.rename;
        //                             // 加入重命名的字段
        //                             data.records[i][newField] = value;
        //                             // 删除旧字段
        //                             delete  data.records[i][oldField];
        //                         }
        //
        //                     }
        //                 }
        //
        //                 // data.fields
        //                 for (var oldField in fieldsConfig) {
        //                     var newFieldConfig = fieldsConfig[oldField];
        //                     var fieldIndex = _.findIndex(data.fields,{"name":oldField});
        //
        //                     //当excluded为true时，删除定义的字段
        //                     if (newFieldConfig.excluded) {
        //                         data.fields.splice(fieldIndex,1);
        //                         continue;
        //                     }
        //                     //当excluded为false且rename不为空时，进行重命名
        //                     if (!newFieldConfig.excluded && !_.isEmpty(newFieldConfig.rename)) {
        //                         data.fields[fieldIndex].name = newFieldConfig.rename;
        //                     }
        //
        //                 }
        //             }
        //         });
        //     }
        //
        //     // 合并结果集，分为left join、inner join
        //     function mergeRecords (joinData,joinType,relations) {
        //
        //         if (joinType == 'inner') {
        //             var afterData = [],
        //                 equation = {};
        //             _.forEach(resultData.records,function(obj,i){
        //                 _.forEach(relations,function(relation,ii){
        //                     equation[relation.right] = obj[relation.left];
        //                 });
        //                 var joinObj = _.find(joinData.records,equation);
        //                 if (!_.isEmpty(joinObj)) {
        //                     // 将两条数据合并为一条（存在重复字段名时只保留obj中的）
        //                     var afterObj = _.defaults(obj,joinObj);
        //                     afterData.push(afterObj);
        //                 }
        //             })
        //             if (!_.isEmpty(afterData)) {
        //                 resultData.records = afterData;
        //                 resultData.fields = _.union(resultData.fields,joinData.fields);
        //             }
        //         } else if (joinType == 'left') {
        //             var equation = {};
        //             _.forEach(resultData.records,function(obj,i){
        //                 _.forEach(relations,function(relation,ii){
        //                     equation[relation.right] = obj[relation.left];
        //                 });
        //                 var joinObj = _.find(joinData.records,equation);
        //                 if (!_.isEmpty(joinObj)) {
        //                     // 将两条数据合并为一条（存在重复字段名时只保留obj中的）
        //                     var afterObj = _.defaults(obj,joinObj);
        //                     resultData.records[i] = afterObj;
        //                 }
        //             })
        //         }
        //
        //     }
        //
        //     var d = $q.defer();
        //
        //     var dses = config.dses;
        //     if (_.isEmpty(dses)) {
        //         messageService.toast('error', '数据集code不能为空');
        //     }
        //
        //     // 最终返回的数据集
        //     var resultData = [];
        //     // 未合并的数据集
        //     var dataSetList = [];
        //     var meataSetList = [];
        //     var promiseQueryDataArray = [];
        //     var promiseQueryMetaArray = [];
        //     // 得到所有的数据集
        //     for (var i=0,size=dses.length;i<size;i++) {
        //         promiseQueryDataArray.push(datasetService.queryDataset(dses[i].code,params));
        //         promiseQueryMetaArray.push(datasetService.queryDatasetMeta(dses[i].code,params));
        //     }
        //     $q.all(promiseQueryDataArray).then(function(data){
        //         dataSetList = data;
        //     }).catch(function(err){
        //         messageService.toast('error', '查询数据集'+dses[i].code+'时报错:>>>'+err.message);
        //         d.reject(err);
        //     }).finally(function(){
        //         $q.all(promiseQueryMetaArray).then(function(data){
        //             meataSetList = data;
        //         }).catch(function(err){
        //             messageService.toast('error', '查询数据集'+dses[i].code+'时报错:>>>'+err.message);
        //             d.reject(err);
        //         }).finally(function(){
        //             dataSetList = _.merge(dataSetList,meataSetList);
        //             // 重命名字段
        //             renameFields(dataSetList);
        //
        //             resultData  = dataSetList[0];
        //
        //             // 以第一个数据集为基础开始依次合并
        //             for (var i=1,size=dataSetList.length;i<size;i++) {
        //                 var relations = dses[i].relations;
        //
        //                 // 合并数据
        //                 mergeRecords(dataSetList[i],'left',relations);
        //             }
        //             resultData.total = resultData.records.length;
        //             d.resolve(resultData);
        //         });
        //     });
        //
        //     console.log(d);
        //     return d.promise;
        //
        // }
    }
})();
