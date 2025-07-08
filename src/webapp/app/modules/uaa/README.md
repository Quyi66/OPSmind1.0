Module uaa is for **U**ser **A**uthentication and **A**uthorization

## 使用方法

1. 引入模块`oplus.uaa`。如果在开发环境想禁用uaa，初始化`uaaServiceProvider`时设置`disableUaa`
```
angular.module('your-app',['oplus.uaa']);
angular.module('your-app').config('uaaServiceProvder',function(uaaServiceProvider){
   uaaServiceProvider.disableUaa();
})
```
2. 用户登录验证成功之后，程序需要调用`currentUser.setUserInfo()`方法为用户信息赋值
3. 用户退出之后，程序需要调用`currentUser.clearUserInfo()`方法清除缓存的用户信息
 

