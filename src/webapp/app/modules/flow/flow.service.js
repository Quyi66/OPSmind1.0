/**
 * @author chy, created on 2022-06-28.
 */
import paramTypes from './constants/param-type.constants'

flowService.$inject = ['flow.Api', '$q'];
export default function flowService(flowApi) {
  var that = this;

  that.fetchProcesses = flowApi.fetchProcesses;
  that.fetchProcess = flowApi.fetchProcess;
  that.fetchProcessVersions = flowApi.fetchProcessVersions;

  that.createProcess = flowApi.createProcess;
  that.editProcess = flowApi.editProcess;
  that.cloneProcess = flowApi.cloneProcess;
  that.copyProcess = flowApi.copyProcess;
  that.deleteProcess = flowApi.deleteProcess;
  that.deleteProcessBatch = flowApi.deleteProcessBatch;
  that.exportProcess = flowApi.exportProcess;

  that.fetchProcessDetail = flowApi.fetchProcessDetail;
  that.changeVersion = flowApi.changeVersion;
  that.editProcessDetail = flowApi.editProcessDetail;
  that.execProcess = flowApi.execProcess;
  that.fetchProcessNodes = flowApi.fetchProcessNodes;
  that.fetchProcessParams = flowApi.fetchProcessParams;

  that.fetchRunDetails = flowApi.fetchRunDetails;
  that.fetchRunningRunDetails = flowApi.fetchRunningRunDetails;
  that.getProcessProgress = flowApi.getProcessProgress;

  that.modifyRunningVariable = flowApi.modifyRunningVariable;

  that.completeTask = flowApi.completeTask;
  that.retryTask = flowApi.retryTask;
  that.terminateInstance = flowApi.terminateInstance;
  that.terminateProcess = flowApi.terminateProcess;
  that.terminateAll = flowApi.terminateAll;

  that.deleteRunDetail = flowApi.deleteRunDetail;
  that.deleteRunDetailBatch = flowApi.deleteRunDetailBatch;


  that.fetchScenes = flowApi.fetchScenes;
  that.createScene = flowApi.createScene;
  that.editScene = flowApi.editScene;
  that.deleteScene = flowApi.deleteScene;

  that.paramTypes = paramTypes;
  that.buildExecParams = function (paramsArr, params) {
    var execParam = {};
    paramsArr.forEach(item => {
      var key = item[0];
      var type = item[1].taskType;
      var neededParams = item[1].params;
      execParam[key] = {};

      var inputParam = params[key];

      neededParams.forEach(param => {
        if (param.type === this.paramTypes.JOB)
          execParam[key][param.name] = {
            jobId: inputParam.jobId,
            jobName: inputParam.jobName
          };
        else if (param.type === this.paramTypes.JSON)
          execParam[key][param.name] = angular.toJson(inputParam.params);
        else if (param.type === this.paramTypes.HOST)
          execParam[key][param.name] = angular.toJson(inputParam[param.name]);
        else if (param.type === this.paramTypes.PROCESS)
          execParam[key][param.name] = {
            processId: inputParam.processId,
            processName: inputParam.processName,
            processDetailId: inputParam.processDetailId,
            sceneId: inputParam.sceneId,
            sceneParams: inputParam.sceneParams,
          };
        else
          execParam[key][param.name] = inputParam[param.name];
      })
    })

    return execParam;
  }
}
