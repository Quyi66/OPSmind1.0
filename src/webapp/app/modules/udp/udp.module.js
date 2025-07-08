/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/16/2017
 */
(function () {

    /**
     * @ngdoc module
     * @name oplus.udp
     */
    var mod = angular.module('oplus.udp', [
        'ui.router.state.events',
        'angularFileUpload',
        'ngclipboard',
        'ng-sortable',
        'ui.sortable',
        'ui.codemirror',
        'ui.tinymce',
        // 'summernote',
        'oplus.commons',
        'oplus.uaa',
        'oplus.dts'
    ])
    //     .config(['$stateProvider', configDecorator]);
    //
    // //https://stackoverflow.com/a/30926025/1524900
    // function configDecorator($stateProvider) {
    //     $stateProvider.decorator('parent', function (internalStateObj, parentFn) {
    //         // This fn is called by StateBuilder each time a state is registered
    //
    //         // The first arg is the internal state. Capture it and add an accessor to public state object.
    //         internalStateObj.self.$$state = function () {
    //             return internalStateObj;
    //         };
    //
    //         // pass through to default .parent() function
    //         return parentFn(internalStateObj);
    //     });
    // }
})();
