// JAO 模块入口文件
// 首先导入模块定义
import "../../webapp/app/modules/jao/jao.module.js";

// 然后导入其他核心组件
import "../../webapp/app/modules/jao/jao.state.js";
import "../../webapp/app/modules/jao/jao-util.js";
import "../../webapp/app/modules/jao/job.service.js";
import "../../webapp/app/modules/jao/job.controller.js";
import "../../webapp/app/modules/jao/job-edit.controller.js";
import "../../webapp/app/modules/jao/job-list.controller.js";
import "../../webapp/app/modules/jao/job-list.component.js";
import "../../webapp/app/modules/jao/job-quick-run.component.js";
import "../../webapp/app/modules/jao/job-result-view.component.js";
import "../../webapp/app/modules/jao/job-run-button.directive.js";
import "../../webapp/app/modules/jao/script-job-config.component.js";
import "../../webapp/app/modules/jao/process-job-config.component.js";
import "../../webapp/app/modules/jao/rest-job-config.component.js";
import "../../webapp/app/modules/jao/script-test-run.component.js";
import "../../webapp/app/modules/jao/ansible-progress-component.js";
import "../../webapp/app/modules/jao/jao-demo.js";

console.log('✅ JAO module loaded'); 