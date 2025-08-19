(function () {
  'use strict';

  angular.module('oplus.udp').service('appletHelper', ['runningState', '$timeout', 'userPref', 'appletRegistry', '$state', 'modalHelper', '$location', appletHelper]);

  function appletHelper(runningState, $timeout, userPref, appletRegistry, $state, modalHelper, $location) {
    var that = this;

    var MAX_CSS = 'maximized';
    var ACTIVE_CSS = 'active';
    var APPLET_WINDOW_CSS = 'op-applet-window';
    var APPLET_WINDOW_ID_PREFIX = 'js-applet-window-';
    var USER_PREF_WINDOW_LAYOUTS = 'windowLayouts';
    var updateLocationWhenActivate = true;

    
    /**
     * Find applet modal window.
     * @param {string} appletCode
     * @return {angular.element} Element of modal or null
     */
    that.findAppletModal = function(appletCode) {
      var elem = $('#' + APPLET_WINDOW_ID_PREFIX + appletCode);
      if (elem.length === 0) return null;
      return elem;
    }

    that.buildOptions = function (applet) {
      var options = {
        resizable: true,
        onModalessActivated: function () {
          //LEO@20220105: activateRunningApplet will change URL
          $timeout(function () {
              // activateRunningApplet(appletCode);
          });
        }
      };
      // console.log('....applet.windowSize', applet.windowSize);
      // 统一设置为最大化
      options.specSize = {width: '100%', height: '100%'};
      // if (openWithMaxWindow) {
      //     options.specSize = 'FILL_CONTENT';
      // }
      
      
      return options;
    }

    that.appletModalOpened = function (appletCode, updateLocationWhenActivate) {
      var modalElem = $('.modal').eq(0);
      modalElem.attr('id', APPLET_WINDOW_ID_PREFIX + appletCode)
        .data('appletcode', appletCode);
      // arrangeWindowPosition(modalElem);
      // restoreWindowLayout(appletCode);
      that.activateRunningApplet(appletCode, updateLocationWhenActivate);
    }

    that.appletModalRendered = function (appletCode) {
        // console.log('appletRunman.openAppletWindow: AppletWindowRendered');
        runningState.emptyBreadcrumb(appletCode);
    }

    /**
     * Hide an applet and show its icon on taskbar
     * @param appletCode
     */
    that.minimizeAppletWindow = function(appletCode) {
      // console.warn('minimizeAppletWindow:' + appletCode);
      var runningApplet = _.find(runningState.allRunningApplets(), {
        code: appletCode
      });
      if (runningApplet) {

        runningApplet.active = false;
      }
      var win = that.findAppletModal(appletCode);
      if (win) {
        win.removeClass(MAX_CSS).removeClass(ACTIVE_CSS).hide();
      }
    }

    that.saveWindowLayout = function(appletCode) {
        var modal = that.findAppletModal(appletCode);
        if (!modal) return;
        var pos = modal.position();
        var container = $('body');
        var containerSize = {width: container.width(), height: container.height()};
        var layout = {
            left: (pos.left / containerSize.width) * 100 + '%',
            top: (pos.top / containerSize.height) * 100 + '%',
            width: (modal.width() / containerSize.width) * 100 + '%',
            height: (modal.height() / containerSize.height) * 100 + '%'
        };
        var layouts = userPref.readItem(USER_PREF_WINDOW_LAYOUTS, {});
        layouts[appletCode] = layout;
        userPref.saveItem(USER_PREF_WINDOW_LAYOUTS, layouts);
    }

    that.closeAppletWindow = function(appletCode) {
      // console.log('appletRunman.closeAppletWindow: applet=%c%s', 'color:orange', appletCode);
      exitStickyState();
      runningState.removeAppletFromRunning(appletCode);
      bringNextWindowToFront();

      function exitStickyState() {
        var def = appletRegistry.findAppletDef(appletCode);
        // LEO@20211216: Exit sticky states when closing, otherwise we cannot re-open the applet.
        // To exit sticky state, we need go to another state, sticky-states will put this state into inactives list.
        // Only inactive states can be exited.
        var currentStateName = def._resolvedState;
        var plugin = $state.router.getPlugin('sticky-states');
        //https://github.com/ui-router/sticky-states/issues/5
        // The code previously didn't allow exitSticky for a state that is currently active, but is scheduled to be inactivated during the new transition. This should be fixed now.
        $timeout(function () {
          // console.log('ExitStickyState', {state: currentStateName, inactives: plugin.inactives()});
          plugin.exitSticky(currentStateName);
        });
      }

      function bringNextWindowToFront() {
        var nextWin;
        var maxZindex = 0;
        $('.' + APPLET_WINDOW_CSS).each(function () {
          var elem = $(this);
          if (elem.data('appletcode') !== appletCode) {
            var zindex = parseInt(elem.css('z-index'));
            if (zindex >= maxZindex) {
              maxZindex = zindex;
              nextWin = elem;
            }
          }
          elem.removeClass(ACTIVE_CSS);
        });
        if (nextWin) {
          nextWin.addClass(ACTIVE_CSS);
          var nextCode = nextWin.data('appletcode');
          // console.log('appletRunman.bringNextWindowToFront: applet=%s, window=%o', nextCode, nextWin);
          that.activateRunningApplet(nextCode, true);
        } else {
          $state.go('app.home')
        }
      }
    }

    
    /**
     * Activate an opened applet, it will
     * - highlight dock icon
     * - bring window to front
     * - update location url
     * @param {string} appletCode
     */
    that.activateRunningApplet = function (appletCode, updateLocationWhenActivate) {
        // console.log('appletRunman.activateRunningApplet: %c%s', 'color:orange', appletCode);
        runningState.allRunningApplets().forEach(function (o) {
            o.active = o.code === appletCode;
        });
        var win = that.findAppletModal(appletCode);
        if (!win) {
            console.error('ProgramError: Cannot find window of running applet [%s]. Now try close applet window to exit state.', appletCode);
            that.closeAppletWindow(appletCode);
            return;
        }
        //LEO@20211225: Use timeout. uibmodal will dynamic change modal z-index, use timeout to wait z-index change
        // To reproduce the issue, open applet from applet list window twice.
        $timeout(function () {
            modalHelper.bringModalessToFront(win);
        });
        // Update location URL.
        // Also, this is a must to change state to exist sticky state of closed window
        if (updateLocationWhenActivate) {
            // console.warn('............updateLocationWhenActivate', JSON.stringify(runningState.allRunningApplets()));
            var url = runningState.findRunningApplet(appletCode).url;
            $location.url(url);
        }
    }


  }

}
)();