/**
 * @ Author: chy
 * @ Create Time: 2023-04-26 22:37:56
 * @ Description:  
 */

import viewerEvents from '../../../constants/viewer-events.constants'

flowDetailViewerCtrl.$inject = ['$scope', '$translate', 'flow.Service', '$state', '$q', 'messageService', 'widgetInteraction', 'widgetValues'];
export default function flowDetailViewerCtrl($scope, $translate, flowService, $state, $q, messageService, widgetInteraction, widgetValues) {
  var that = this;

  const modelerTypes = {
    edit: "edit",
    add: "add"
  }
    
  that.options = that.options || {
    runBtn: undefined,
    designBtn: undefined
  }

  if (that.options.inPage) {
    that.processId = $scope.$parent.$widget.$pageScope.pageParams.processId || that.processId || undefined;
    that.detailId = $scope.$parent.$widget.$pageScope.pageParams.detailId || that.detailId || undefined;
  }
  
  flowService.fetchProcess(that.processId).then(function (data) {
    that.process = data;
  });

  that.queryDetail = (needReRender) => {
    flowService.fetchProcessDetail(that.processId, that.detailId || null).then(function (data) {
      that.processDetail = data;


      if (that.options.inPage && $scope.$parent.$widget && that.options.pageParamName) {
        $scope.$parent.$widget.$pageScope.pageParams[that.options.pageParamName] = {
          processId: that.processId,
          processDetailId: that.processDetail.id
        };
        if (that.options.pageEvent)
          $scope.$parent.$widget.$pageScope.$broadcast(widgetValues.events.WidgetEvent, { eventName: that.options.pageEvent });
      }

      if (needReRender) {
        that.broadcastReRenderAsync(data.processXml).then(res => {
          that.getProcessProgress();
        })
      }
    });
  }

  that.queryDetail();

  that.designProcess = (e) => {
    if (that.options.designBtn && that.options.designBtn.pageId) {

      that.options.designBtn['params'] = angular.toJson(angular.extend(that.options.designBtn['params'] && angular.fromJson(that.options.designBtn['params']) || {}, {
        designType: 'edit',
        processId: that.processId,
        process: '${process}',
      }))
      
      widgetInteraction.openPage(that.options.designBtn, {
        process: angular.toJson(that.process),
      }, {
        current: angular.element(e.currentTarget).parents('flow-detail-viewer'),
        scope: $scope.$parent.$widget.$pageScope
      })
    } else {
      $state.go('app.flow.design', {
        type: modelerTypes.edit,
        processId: that.processId,
        processName: that.process.processName
      });
    }
  }

  that.execProcess = (e) => {
    if (that.options.runBtn && that.options.runBtn.pageId) {

      that.options.runBtn['params'] = angular.toJson(angular.extend(that.options.runBtn['params'] && angular.fromJson(that.options.runBtn['params']) || {}, {
        processId: that.processId,
      }))

      widgetInteraction.openPage(that.options.runBtn, {}, {
        current: angular.element(e.currentTarget).parents('flow-detail-viewer'),
        scope: $scope.$parent.$widget.$pageScope
      })
    }
    else {
      $state.go('app.flow.exec', {
        processId: that.processId,
        detailId: that.processDetail.id
      });
    }
  }

  $scope.$on(viewerEvents.emitBpmnViewer, (e, data) => {
    that.bpmnViewer = data;
  })

  $scope.$on(viewerEvents.emitProcessAttrs, (e, data) => {
    that.processAttrs = data;
  })

  that.broadcastReRenderAsync = (bpmnXml) => {
    var defer = $q.defer();
    $scope.$broadcast(viewerEvents.broadcastReRender, bpmnXml, defer);
    return defer.promise;
  }

}