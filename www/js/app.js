// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('rollcall', ['ionic', 'rollcall.controllers', 'rollcall.services', 'ionic-native-transitions'])
// var app = angular.module('rollcall', ['ionic', 'rollcall.controllers', 'rollcall.services'])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });

    $ionicPlatform.registerBackButtonAction(function (e){
      //阻止默认的行为
      e.preventDefault();
      // 退出提示框
      function showConfirm() {
        var servicePopup = $ionicPopup.show({
          title: '提示',
          subTitle: '你确定要退出应用吗？',
          scope: $rootScope,
          buttons: [
            {
              text: '取消',
              type: 'button-clear button-assertive',
              onTap: function () {
                return 'cancel';
              }
            },
            {
              text: '确认',
              type: 'button-clear button-assertive border-left',
              onTap: function (e) {
                return 'active';
              }
            },
          ]
        });
        servicePopup.then(function (res) {
          if (res == 'active') {
            // 退出app
            ionic.Platform.exitApp();
          }
        });
      }
      showConfirm();
      return false;
    }, 101);
  })

  .constant('ENVIRONMENT', 'prod')

  .constant('SERVER_URL', {

    path: 'http://jlartdm.kaiwait.com/index.php'


  })
  .constant('REST_SERVICES', {
    login: '/RollCallService/appLogin',
    changePwd: '/RollCallService/changePwd',
    getStudentsList: '/RollCallService/getStudentsList',
    getStatusByClassID: '/RollCallService/getStatusByClassID',
    setStudentsCallList: '/RollCallService/setStudentsCallList',
    checkConmitTimes: '/RollCallService/checkConmitTimes'
  })


  .config(function($ionicNativeTransitionsProvider){
    $ionicNativeTransitionsProvider.setDefaultOptions({
      duration: 100, // in milliseconds (ms), default 400,
      slowdownfactor: 1, // overlap views (higher number is more) or no overlap (1), default 4
      iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
      androiddelay: -1, // same as above but for Android, default -1
      winphonedelay: -1, // same as above but for Windows Phone, default -1,
      fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
      fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
      triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
      backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
    });
  })
  .config(function($ionicNativeTransitionsProvider){
    $ionicNativeTransitionsProvider.setDefaultTransition({
      type: 'fade',
      direction: 'left'
    });
  })
  .config(function($ionicNativeTransitionsProvider){
    $ionicNativeTransitionsProvider.setDefaultBackTransition({
      type: 'slide',
      direction: 'right'
    });
  })
  .config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('bottom');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');
    $ionicConfigProvider.views.swipeBackEnabled(false);
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('login', {
        url: '/login',
        // abstract: true,
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })

      // Each tab has its own nav history stack:

      .state('app', {
        url: '/app',
        templateUrl: 'templates/app.html'


      })

      .state('app.home', {
        url: '/home',
        views: {
          'main-view': {
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl'
          }
        }
      })

      .state('app.signlist', {
        url: '/signlist/:id',
        views: {
          'main-view': {
            templateUrl: 'templates/sign_list.html',
            controller: 'SignListCtrl'
          }
        }
      })

      .state('app.detail', {
        url: '/signsingle/:cid/:sid',
        views: {
          'main-view': {
            templateUrl: 'templates/sign_single.html',
            controller: 'signSingleCtrl'
          }
        }
      })

      .state('app.signstate', {
        url: '/signstate/:id',
        views: {
          'main-view': {
            templateUrl: 'templates/sign_state.html',
            controller: 'SignStateCtrl'
          }
        }
      })

      .state('app.result', {
        url: '/result',
        views: {
          'main-view': {
            templateUrl: 'templates/sign_result.html',
            controller: 'ResultCtrl'
          }
        }
      })

      .state('app.history', {
        url: '/history',
        views: {
          'main-view': {
            templateUrl: 'templates/history.html',
            controller: 'HistoryCtrl'
          }
        }
      })

      .state('app.selecthistory', {
        url: '/selecthistory',
        views: {
          'main-view': {
            templateUrl: 'templates/selecthistory.html',
            controller: 'SearchHistoryCtrl'
          }
        }
      })
      .state('app.historycategory', {
        url: '/historycategory',
        views: {
          'main-view': {
            templateUrl: 'templates/historycategory.html',
            controller: 'HistoryCategoryCtrl'
          }
        }
      })
      .state('app.historydetail', {
        url: '/historydetail/:cid/:ctime',
        views: {
          'main-view': {
            templateUrl: 'templates/historydetail.html',
            controller: 'HistoryDetailCtrl'
          }
        }
      })



      .state('app.changepwd', {
        url: '/changepwd',
        views: {
          'main-view': {
            templateUrl: 'templates/changepwd.html',
            controller: 'ChangePwdCtrl'
          }
        }
      })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

  });
