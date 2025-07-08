/**
 * @ Author: chy
 * @ Create Time: 2022-07-07 10:55:14
 * @ Description:  
 */

flowApi.$inject = ['restUtils', 'OpDownload']
export default function flowApi(restUtils, OpDownload) {
  var that = this;
  var module = "flow";

  /**
   * 分页获取流程列表
   */
  that.fetchProcesses = function () {
    return restUtils.callApi(module, 'GET', '/api/flow/process/list');
  }
  /**
   * 分页获取流程列表
   */
  that.fetchProcess = function (id) {
    return restUtils.callApi(module, 'GET', '/api/flow/process', null, {id: id});
  }

  /**
   * 分页获取流程历史版本
   */
  that.fetchProcessVersions = function (id) {
    return restUtils.callApi(module, 'GET', '/api/flow/process/version', null, {processId: id});
  }

  /**
   * 创建流程
   * @param params
   */
  that.createProcess = function (data) {
    return restUtils.callApi(module, 'POST', '/api/flow/process', null, data);
  }

  /**
   * 编辑流程
   * @param params
   */
  that.editProcess = function (data) {
    return restUtils.callApi(module, 'PUT', '/api/flow/process', null, data);
  }

  /**
   * 克隆流程
   * @param params
   */
  that.cloneProcess = function (data) {
    return restUtils.callApi(module, 'POST', '/api/flow/process/clone', null, data);
  }

  /**
   * 复制流程
   * @param params
   */
  that.copyProcess = function (data) {
    return restUtils.callApi(module, 'POST', '/api/flow/process/copy', null, data);
  }

  /**
   * 删除流程
   * @param params
   */
  that.deleteProcess = function (id) {
    return restUtils.callApi(module, 'DELETE', '/api/flow/process/{id}', {id: id});
  }

  /**
   * 批量删除流程
   * @param params
   */
  that.deleteProcessBatch = function (ids) {
    return restUtils.callApi(module, 'POST', '/api/flow/process/delete/batch', null, ids);
  }


  that.exportProcess = function (ids) {
    OpDownload.download(restUtils.getApiUrl(module, '/api/flow/process/export'), null, 'POST', null, ids);
  }

  /**
  * 执行流程
  * @param params
  */
  that.execProcess = function (data) {
    return restUtils.callApi(module, 'POST', '/api/flow/process/exec', null, data, {
      responseType: 'text',
      transformResponse: function (data) {
        return data;
      }
    });
  }

  /**
   * 获取流程详情
   * @param params
   */
  that.fetchProcessDetail = function (processId, detailId) {
    return restUtils.callApi(module, 'GET', '/api/flow/process/detail', null, { processId: processId, detailId: detailId });
  }

  /**
   * 切换版本
   */
  that.changeVersion = function ({processId, detailId}) {
    return restUtils.callApi(module, 'PUT', '/api/flow/process/version', null, { processId: processId, detailId: detailId });
  }

  /**
  * 修改流程详情
  * @param params
  */
  that.editProcessDetail = function (data) {
    return restUtils.callApi(module, 'PUT', '/api/flow/process/detail', null, data);
  }

  /**
   * 获取流程节点
   * @param params
   */
  that.fetchProcessNodes = function (processId) {
    return restUtils.callApi(module, 'GET', '/api/flow/process/nodes', null, {
      processId: processId
    });
  }

  /**
   * 获取流程参数
   * @param params
   */
  that.fetchProcessParams = function (processId) {
    return restUtils.callApi(module, 'GET', '/api/flow/process/params', null, {
      processId: processId
    });
  }

  /**
   * 获取流程执行列表
   * @param params
   */
  that.fetchRunDetails = function (processId) {
    return restUtils.callApi(module, 'GET', '/api/flow/execution/list', null, {
      processId: processId
    });
  }

  /**
   * 获取运行中流程执行列表
   * @param params
   */
  that.fetchRunningRunDetails = function (processId) {
    return restUtils.callApi(module, 'GET', '/api/flow/execution/running', null, {
      processId: processId
    });
  }

  /**
   * 获取流程执行进度
   * @param params
   */
  that.getProcessProgress = function (instanceId) {
    return restUtils.callApi(module, 'GET', '/api/flow/process/progress', null, {
      instanceId: instanceId
    });
  }

  /**
  * 修改运行中实例任务参数
  * @param params
  */
  that.modifyRunningVariable = function (data) {
    return restUtils.callApi(module, 'PUT', '/api/flow/process/variable/modify', null, data);
  }

  /**
   * 完成任务
   * @param params
   */
  that.completeTask = function (instanceId, externalTaskId, workerId) {
    return restUtils.callApi(module, 'GET', '/api/flow/process/task/complete', null, {
      instanceId: instanceId,
      externalTaskId: externalTaskId,
      workerId: workerId
    });
  }

  /**
   * 重试任务
   * @param params
   */
  that.retryTask = function (instanceId, externalTaskId, taskId) {
    return restUtils.callApi(module, 'GET', '/api/flow/process/task/retry', null, {
      instanceId: instanceId,
      externalTaskId: externalTaskId,
      taskId: taskId
    });
  }

  /**
   * 终止流程实例
   * @param params
   */
  that.terminateInstance = function (instanceId) {
    return restUtils.callApi(module, 'POST', '/api/flow/execution/terminate', null, {
      instanceId: instanceId,
    });
  }

  /**
   * 终止流程实例(根据流程 ID)
   * @param params
   */
  that.terminateProcess = function (processId) {
    return restUtils.callApi(module, 'POST', '/api/flow/execution/terminate', null, {
      processId: processId,
    });
  }

  /**
   * 终止所有流程实例
   * @param params
   */
  that.terminateAll = function () {
    return restUtils.callApi(module, 'POST', '/api/flow/execution/terminate', null, {
      processId: 'all',
    });
  }

  /**
   * 删除流程
   * @param params
   */
  that.deleteRunDetail = function (id) {
    return restUtils.callApi(module, 'DELETE', '/api/flow/execution/{id}', {id: id});
  }

  /**
   * 批量删除流程
   * @param params
   */
  that.deleteRunDetailBatch = function (ids) {
    return restUtils.callApi(module, 'POST', '/api/flow/execution/delete/batch', null, ids);
  }


  /**
   * 获取场景列表
   */
  that.fetchScenes = function (processId) {
    return restUtils.callApi(module, 'GET', '/api/flow/scene', null, {
      processId: processId
    });
  }

  /**
   * 创建场景
   * @param params
   */
  that.createScene = function (data) {
    return restUtils.callApi(module, 'POST', '/api/flow/scene', null, data, {
      responseType: 'text',
      transformResponse: function (data) {
        return data;
      }
    });
  }

  /**
   * 编辑场景
   * @param params
   */
  that.editScene = function (data) {
    return restUtils.callApi(module, 'PUT', '/api/flow/scene', null, data);
  }

  /**
   * 删除场景
   * @param params
   */
  that.deleteScene = function (id) {
    return restUtils.callApi(module, 'DELETE', '/api/flow/scene/{id}', { id: id });
  }
}