/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 01/29/2018
 */
(function () {
    /**
     *
     * https://stackoverflow.com/questions/783818/how-do-i-create-a-custom-error-in-javascript
     * @param {Error|String} reason Cause of the error
     * @constructor
     */
    function FatalError(reason) {
        if (_.isError(reason)) {
            this.message = reason.message;
        } else {
            this.message = (reason || "");
        }
        this.name = "FatalError";
    }

    FatalError.prototype = new Error();
    window.FatalError = FatalError;
})();
(function () {
    /**
     * Widget dataset or field not configured properly.
     * @param message
     * @constructor
     */
    function WidgetNotConfiguredError(message) {
        // this.name = 'WidgetNotConfiguredError';
        this.message = message;
    }

    WidgetNotConfiguredError.prototype = new Error();

    /**
     *
     * @param message
     * @param title
     * @constructor
     */
    function WidgetDataError(message, title) {
        this.message = message;
        this.title = title;
    }

    WidgetDataError.prototype = new Error();

    window.WidgetNotConfiguredError = WidgetNotConfiguredError;
    window.WidgetDataError = WidgetDataError;
})();

(function () {
    angular.module('oplus.udp')
        .service('errorHandler', [errorHandler])
        .factory('$exceptionHandler', ['errorHandler',
            function exceptionHandler(errorHandler) {
                return function (exception, cause) {
                    errorHandler.processError(exception, '$exceptionHandler');
                };
            }]);

    /**
     * @name errorHandler
     */
    function errorHandler() {
        var continuousErrors = {};
        var CONTINUOUS_ERROR_LIMIT = 3;
        this.processError = processError;
        this.stopOverError = stopOverError;
        this.clearError = clearError;
        this.accumulateError = accumulateError;

        /**
         * Check the accumulated continuous amount of a specific kind of error.
         * If the amount exceeds defined limit, it will invoke callback function.
         * @param {string} kind Kind of error to check
         * @param {string} message The message used as callback parameter error.message.
         * @param {function(Error)} callback Callback function.
         * TODO: rename to callbackIfErrorExceedsLimit?
         */
        function stopOverError(kind, message, callback) {
            if (continuousErrors[kind] > CONTINUOUS_ERROR_LIMIT) {
                var err = new Error();
                err.name = 'ERROR_STOPPER';
                err.message = message;
                if (angular.isFunction(callback)) {
                    callback(err);
                }
            }
        }

        /**
         * Accumulate the continuous amount of a specific kind of error.
         * @param {string} kind Kind of error
         */
        function clearError(kind) {
            continuousErrors[kind] = undefined;
            delete continuousErrors[kind];
        }

        /**
         * Accumulate the continuous amount of a specific kind of error.
         * @param {string} kind Kind of error
         */
        function accumulateError(kind) {
            continuousErrors[kind] = (continuousErrors[kind] || 0) + 1;
        }

        function processError(err, from) {
            if (err.name === 'ERROR_STOPPER') {
                console.error(err.message);
                return;
            }
            if (err.name === 'FatalError') {
                console.error(err);
                alert(err.message);
                return;
            }
            if (err.message && err.message.indexOf('Cannot read property \'length\' of undefined') > -1 && err.stack.indexOf('Scope.scope.isOpen') > -1) {
                console.warn('20200911: Minor error in uib-typeahead: at Scope.scope.isOpen (ui-bootstrap-tpls-modified.js:7337)');
                return;
            }
            if (err.message && (err.message.indexOf('Cannot read property \'clientWidth\' of null') > -1
                || err.message.indexOf('Cannot read properties of null (reading \'clientWidth\')') > -1)) {
                // Annoying datatables error
                // console.warn(err);
                return;
            }
            // if(err instanceof AlertError){
            //     messageService.alertError(err.name,err.message);
            // }
            console.error(from, err);
            // alert(err.message);
            // TODO: send error to server
        }
    }
})();
