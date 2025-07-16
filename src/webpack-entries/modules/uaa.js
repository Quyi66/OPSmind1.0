// UAA 模块入口文件
// 首先导入模块定义
import "../../webapp/app/modules/uaa/uaa.module.js";

// 然后导入核心服务
import "../../webapp/app/modules/uaa/account.state.js";
import "../../webapp/app/modules/uaa/account.service.js";
import "../../webapp/app/modules/uaa/activate.service.js";
import "../../webapp/app/modules/uaa/auth.jwt.service.js";
import "../../webapp/app/modules/uaa/auth.service.js";
import "../../webapp/app/modules/uaa/current-user.js";
import "../../webapp/app/modules/uaa/ldap.service.js";
import "../../webapp/app/modules/uaa/license.service.js";
import "../../webapp/app/modules/uaa/password-reset-finish.service.js";
import "../../webapp/app/modules/uaa/password-reset-init.service.js";
import "../../webapp/app/modules/uaa/password.service.js";
import "../../webapp/app/modules/uaa/permission-resolver.js";
import "../../webapp/app/modules/uaa/principal.service.js";
import "../../webapp/app/modules/uaa/register.service.js";
import "../../webapp/app/modules/uaa/uaa-init.js";
import "../../webapp/app/modules/uaa/uaa-service.js";
import "../../webapp/app/modules/uaa/user-habit.service.js";
import "../../webapp/app/modules/uaa/user.service.js";

// 登录相关
import "../../webapp/app/modules/uaa/login/login.service.js";
import "../../webapp/app/modules/uaa/login/login.state.js";
import "../../webapp/app/modules/uaa/login/login.component.js";
import "../../webapp/app/modules/uaa/login/login-main.controller.js";
import "../../webapp/app/modules/uaa/login/license-register.controller.js";

// 权限指令
import "../../webapp/app/modules/uaa/data-has-permission.directive.js";
import "../../webapp/app/modules/uaa/has-any-permission.directive.js";
import "../../webapp/app/modules/uaa/has-any-role.directive.js";
import "../../webapp/app/modules/uaa/has-permission.directive.js";
import "../../webapp/app/modules/uaa/has-role.directive.js";
import "../../webapp/app/modules/uaa/is-authenticated.directive.js";

console.log('✅ UAA module loaded'); 