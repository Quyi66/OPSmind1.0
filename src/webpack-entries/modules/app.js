// APP 模块入口文件
// 首先导入模块定义
import "../../webapp/app/modules/app/applet.module.js";

// 然后导入其他组件
import "../../webapp/app/modules/app/applet.state.js";
import "../../webapp/app/modules/app/applet.service.js";
import "../../webapp/app/modules/app/applet-security.js";
import "../../webapp/app/modules/app/applet-config-access.component.js";
import "../../webapp/app/modules/app/applet-help.controller.js";
import "../../webapp/app/modules/app/applet-item.component.js";
import "../../webapp/app/modules/app/applet-list.component.js";
import "../../webapp/app/modules/app/applet-mgmt-datamodels.controller.js";
import "../../webapp/app/modules/app/applet-mgmt-datasets-edit.controller.js";
import "../../webapp/app/modules/app/applet-mgmt-datasets.controller.js";
import "../../webapp/app/modules/app/applet-mgmt-jobs.controller.js";
import "../../webapp/app/modules/app/applet-mgmt-pages.controller.js";
import "../../webapp/app/modules/app/applet-setting.controller.js";

console.log('✅ APP module loaded'); 