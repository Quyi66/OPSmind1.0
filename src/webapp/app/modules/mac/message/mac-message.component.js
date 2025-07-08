/**
 * @author chy, created on 2021-10-20.
 */

(function () {
  'use strict';

  angular.module('oplus.mac').component('macMessageHeader', {
    templateUrl: 'app/modules/mac/message/mac-message-header.html',
    controller: macMessageController,
    controllerAs: '$ctrl'
  });

  angular.module('oplus.mac').component('macMessageFixed', {
    templateUrl: 'app/modules/mac/message/mac-message-fixed.html',
    controller: macMessageController,
    controllerAs: '$ctrl'
  });

  angular.module('oplus.mac').component('macMessagePanel', {
    templateUrl: 'app/modules/mac/message/mac-message-panel.html',
    controller: macMessagePanelController,
    controllerAs: '$ctrl',
    bindings: {
      newMessageCount: '='
    }
  });

  // 收件箱载体 Controller
  macMessageController.$inject = ['$scope']

  function macMessageController($scope) {
    var that = this;
    that.newMessageCount = 0;
    that.panelShow = function () { return !$('mac-message-panel').css('display') === 'none' }();

    // Fixed
    // that.mouseDownState = false;
    // that.iX = 0;
    // that.iY = 0,
    // that.dX = 0;
    // that.dY = 500; //  初始定位
    // that.lastMoveIndex = 0; //  拖拽计数
    // that.curMoveIndex = 0; //  历史计数

    // that.mouseDown = function(event) {
    //   //  如果打开了菜单，则不做响应
    //   if (that.panelShow) {
    //     that.mouseDownState = false;
    //     return
    //   }
    //   console.log("mouseDown", event);

    //   var touch = that.getTouchEvent(event);
      
    //   // 鼠标点击 面向页面 的 x坐标 y坐标
    //   var { clientX, clientY } = touch;
    //   // 鼠标x坐标 - 拖拽按钮x坐标  得到鼠标 距离 拖拽按钮 的间距
    //   that.iX = clientX - that.$refs.actionMgr.offsetLeft;
    //   // 鼠标y坐标 - 拖拽按钮y坐标  得到鼠标 距离 拖拽按钮 的间距
    //   that.iY = clientY - that.$refs.actionMgr.offsetTop;
    //   that.mouseDownState = true;
    // }

    // // 鼠标拖拽
    // that.mouseMove = function(event) {
    //   //鼠标按下 切移动中
    //   if (that.mouseDownState) {
    //     console.log("mouseMove", event);

    //     var touch = that.getTouchEvent(event);
    //     // 鼠标点击 面向页面 的 x坐标 y坐标
    //     var { clientX, clientY } = touch;
    //     //当前页面全局容器 dom 元素  获取容器 宽高
    //     var { clientHeight: pageDivY, clientWidth: pageDivX } = that.$refs.pageDiv;
    //     /* 鼠标坐标 - 鼠标与拖拽按钮的 间距坐标  得到 拖拽按钮的 左上角 x轴y轴坐标 */
    //     var [x, y] = [clientX - this.iX, clientY - this.iY];
    //     //拖拽按钮 dom 元素  获取 宽高 style 对象
    //     var { clientHeight: actionMgrY, clientWidth: actionMgrX, style: actionMgrStyle } = that.$refs.actionMgr;
    //     /* 此处判断 拖拽按钮 如果超出 屏幕宽高 或者 小于
    //         设置 屏幕最大 x=全局容器x y=全局容器y 否则 设置 为 x=0 y=0
    //     */
    //     if (x > pageDivX - actionMgrX) x = pageDivX - actionMgrX;
    //     else if (x < 0) x = 0;
    //     if (y > pageDivY - actionMgrY) y = pageDivY - actionMgrY;
    //     else if (y < 0) y = 0;

    //     this.dX = x;
    //     this.dY = y;
    //     // 计算后坐标  设置 按钮位置
    //     actionMgrStyle.left = x + 'px';
    //     actionMgrStyle.top = y +'px';
    //     actionMgrStyle.bottom = "auto";
    //     actionMgrStyle.right = "auto";
    //     //  move Index
    //     this.lastMoveIndex++;
    //     //  当按下键滑动时， 阻止屏幕滑动事件
    //     event.preventDefault();
    //   }
    // }
    
    // // 鼠标抬起
    // that.mouseUp = function(event) {
    //   console.log("mouseUp", event);
    //   //  当前页面全局容器 dom 元素  获取容器 宽高
    //   var { clientHeight: windowHeight, clientWidth: windowWidth } = document.documentElement;
    //   console.log('全局容器:', windowWidth, windowHeight);
    //   //  拖拽按钮 dom 元素  获取 宽高 style 对象
    //   var { clientHeight: actionMgrY, clientWidth: actionMgrX, style: actionMgrStyle } = that.$refs.actionMgr;
    //   console.log('拖拽按钮', actionMgrY, actionMgrX, actionMgrStyle);

    //   // 计算后坐标  设置 按钮位置
    //   if (this.dY > 0 && this.dY < (windowHeight - 50)) { //  不在顶部 且 不在底部
    //     if (this.dX <= (windowWidth / 2)) { //  left 小于等于屏幕一半
    //       actionMgrStyle.left = 0;
    //       actionMgrStyle.right = 'auto';
    //     } else { //  left 大于屏幕一半
    //       actionMgrStyle.left = 'auto';
    //       actionMgrStyle.right = 0;
    //     }
    //     if (this.dY >= (windowHeight / 2)) { //  宽度大于1/2时，是将top改为auto，调整bottom
    //       actionMgrStyle.top = 'auto';
    //       actionMgrStyle.bottom = (windowHeight - this.dY - 50) + 'px';
    //     }
    //   }
    //   else {
    //     if (this.dY === 0) { //  在顶部
    //       actionMgrStyle.top = 0;
    //       actionMgrStyle.bottom = 'auto';
    //     } else if (this.dY === (windowHeight - 50)) {
    //       actionMgrStyle.bottom = 0;
    //       actionMgrStyle.top = 'auto';
    //     }
    //     if (this.dX >= (windowWidth / 2)) { //  右侧是将left改为auto，调整right
    //       actionMgrStyle.left = 'auto';
    //       actionMgrStyle.right = (windowWidth - this.dX - 50) + 'px';
    //     }
    //   }
    //   this.mouseDownState = false;
    // }

    // that.getTouchEvent = function (event) {
    //   /* 此处判断  pc 或 移动端 得到 event 事件 */
    //   if (event.touches) return event.touches[0];
    //   return event;
    // }
  }

  // 收件箱面板 Controller
  macMessagePanelController.$inject = ['$scope', '$state', 'messageService', 'macService', '$translate'];

  function macMessagePanelController($scope, $state, messageService, macService, $translate) {
    var that = this;
    var defaultPollTime = 30;

    that.convertToZhTWP = macService.convertToZhTWP;

    that.pageNum = 1;
    that.pageSize = 5;

    that.messages = [];
    that.newMessageCount = that.newMessageCount || 0;
    that.panelShow = that.panelShow || false;
    that.hasMore = true;

    that.polling = false;
    that.lastPollTimestamp = 0;
    that.longPollTime = 1;
    that.longPoll = setInterval(function () {
      if ($oplus.appConfig.modules.mac.poll && !that.polling && --that.longPollTime === 0) {
        that.polling = true;
        macService.fetchNewMessagesCount(that.lastPollTimestamp).then(that.longPollHandler).catch(that.longPollPreHandle);
      }
    }, 1000);

    $scope.$on('destroy-poll-messages', function () {
      console.log('destroy-poll-messages')
      clearInterval(that.longPoll);
    })

    that.longPollPreHandle = function (ex) {
      that.polling = false;
      if(!ex) that.lastPollTimestamp = Date.now();
      that.longPollTime = defaultPollTime;
    }

    that.longPollHandler = function (count) {
      that.longPollPreHandle();

      if (count > 0) that.fetchMessages(1, count, true);
    }

    that.fetchMessages = function (pageNum, pageSize, isNew) {
      macService.fetchMessages(pageNum, pageSize).then(function (messages) {
        var messageIds = that.messages.map(function(m){ return m.id })
        var diff = messages.filter(function (f) { return messageIds.indexOf(f.id) === -1 })
        if (isNew) {
          that.messages.unshift.apply(that.messages, diff);
          that.newMessageCount += diff.length;
          // messageService.toast("info", " 您有未读消息待处理");
        }
        else that.messages.push.apply(that.messages, diff);
        if (messages.length < pageSize) that.hasMore = false;
      });
    }

    that.stopPropagation = function (e) {
      e.stopPropagation();
    }

    that.handleMessage = function (message, doJump) {
      if (message.status === 0) {
        macService.handleMessage(message.id).then(function () {
          message.status = 1;
          that.newMessageCount -= 1;
        });
      }
      
      if (doJump) {
        if (message.linkType === 'external')
          window.open(message.link);
        else if (message.linkType === 'internal') {
          $state.go(message.link, JSON.parse(message.linkParams));
        }
      }
    }

    that.fetchMoreMessages = function () {
      var pageSize = that.pageSize + (that.messages.length % that.pageSize);
      that.pageNum = Math.floor(that.messages.length / pageSize) + 1;

      that.fetchMessages(that.pageNum, pageSize, false);
    }

    that.getMessageText = function(term){
      var currentLang = $translate.use();
      if (currentLang === 'zh-tw')
        return that.convertToZhTWP(term);
      else return term;
    }
  }
})();
