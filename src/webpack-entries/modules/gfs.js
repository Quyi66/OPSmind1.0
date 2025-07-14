// GFS 模块入口文件
// 首先导入模块定义
import "../../webapp/app/modules/gfs/gfs.module.js";

// 然后导入其他组件
import "../../webapp/app/modules/gfs/gfs.state.js";
import "../../webapp/app/modules/gfs/gfile.service.js";
import "../../webapp/app/modules/gfs/gfs-action-helper.js";
import "../../webapp/app/modules/gfs/gfs-example.controller.js";
import "../../webapp/app/modules/gfs/gfile-edit.controller.js";
import "../../webapp/app/modules/gfs/repo-approve.controller.js";
import "../../webapp/app/modules/gfs/repo-navi.controller.js";
import "../../webapp/app/modules/gfs/gfile-rev.component.js";
import "../../webapp/app/modules/gfs/gfile-list.component.js";
import "../../webapp/app/modules/gfs/gfile-content.component.js";
import "../../webapp/app/modules/gfs/file-change-status.component.js";

// Widgets
import "../../webapp/app/modules/gfs/widgets/fileselector/fileselector-widget.js";
import "../../webapp/app/modules/gfs/widgets/fileselector/file-selector.component.js";

console.log('✅ GFS module loaded'); 