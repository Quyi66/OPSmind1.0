/**
 * @author Leo Liao(leoliaolei@gmail.com), 2022/01/14, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name umdConfigOperation
     * @description
     * Configure operations of a model.
     * ```html
     * <umd-config-operation
     *      operation-defs="[{icon:string,title:string,disabled:boolean=,config:{}}]"/>
     * @param {[{icon:string,title:string,disabled:boolean=,config:{}}]} operationDefs Two-way binding of operation definition list
     * ```
     */
    angular.module('oplus.commons').component('umdConfigOperation', {
        bindings: {
            operationDefs: '='
        },
        templateUrl: 'app/modules/commons/umd/umd-config-operation.component.html',
        controller: ['$scope', '$element', 'modalHelper', '$translate', 'messageService', UmdConfigOperationCtrl]
    });

    /**
     *
     * @param $scope
     * @param $element
     * @param {modalHelper} modalHelper
     * @param {$translate} $translate
     * @param {messageService} messageService
     */
    function UmdConfigOperationCtrl($scope, $element, modalHelper, $translate, messageService) {
        var that = this;
        this.operationDefs = this.operationDefs || [];
        this.addOperation = addOperation;
        this.removeOperation = removeOperation;
        this.editOperation = editOperation;
        this.$onInit = onInit;

        function editOperation(index) {
            openEditModal(index);
        }

        function addOperation() {
            openEditModal(-1);
        }

        /**
         * Open edit modal for an operation
         * @param {number} index Zero-based index in the operation list
         */
        function openEditModal(index) {
            var operation = index < 0 ? {} : that.operationDefs[index];
            // console.log('openEditModal:operation=%o',operation);
            var modalInstance = modalHelper.openModal({
                templateUrl: 'app/modules/commons/umd/umd-edit-operation-modal.html',
                controller: [function UmdEditOperationCtrl() {
                    var self = this;
                    this.theOperation = angular.copy(operation);
                    this.cancel = function () {
                        modalInstance.dismiss();
                    }
                    this.submit = function () {
                        modalInstance.close(self.theOperation);
                        if (index < 0) {
                            that.operationDefs.push(self.theOperation);
                        } else {
                            that.operationDefs[index] = self.theOperation;
                        }
                    }
                }],
                controllerAs: '$ctrl'
            });
        }

        function removeOperation(index) {
            messageService.confirm('Delete', 'Delete this operation?', function () {
                that.operationDefs.splice(index, 1);
            });
        }

        function onInit() {
        }
    }
})();
