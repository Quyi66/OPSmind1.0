// DTS 模块入口文件
// 首先导入模块定义
import "../../webapp/app/modules/dts/dts.module.js";

// 然后导入其他组件
import "../../webapp/app/modules/dts/dts.state.js";
import "../../webapp/app/modules/dts/datasource.service.js";
import "../../webapp/app/modules/dts/datasource-edit.controller.js";
import "../../webapp/app/modules/dts/datasource.controller.js";
import "../../webapp/app/modules/dts/datasource-list.component.js";
import "../../webapp/app/modules/dts/datasource-new.controller.js";
import "../../webapp/app/modules/dts/dataset.service.js";
import "../../webapp/app/modules/dts/dataset-list.component.js";
import "../../webapp/app/modules/dts/dataset-edit.component.js";
import "../../webapp/app/modules/dts/dataset-list.controller.js";
import "../../webapp/app/modules/dts/api.service.js";

// DAO 层
import "../../webapp/app/modules/dts/dao/datasource-dao.js";
import "../../webapp/app/modules/dts/dao/_datasource-local-dao.js";
import "../../webapp/app/modules/dts/dao/_datasource-remote-dao.js";
import "../../webapp/app/modules/dts/dao/dataset-dao.js";
import "../../webapp/app/modules/dts/dao/_dataset-remote-dao.js";
import "../../webapp/app/modules/dts/dao/local-dataset-repo.js";
import "../../webapp/app/modules/dts/dao/client-cache-dataset.js";
import "../../webapp/app/modules/dts/dao/mock-excel-dataset.js";
import "../../webapp/app/modules/dts/dao/mock-js-dataset.js";

console.log('✅ DTS module loaded'); 