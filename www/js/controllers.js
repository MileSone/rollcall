angular.module('rollcall.controllers', [])

  .controller('MainCtrl', function($rootScope,$window,$ionicLoading,$ionicPopup, $state, $scope, $stateParams, $timeout, Student) {

    $rootScope.currentTitle = '';
    $rootScope.showTitle = false;

    $rootScope.signSelectedType = 1;
    $rootScope.classInfos = null;
    $rootScope.userName = '';
    $rootScope.password = '';




    function getDateStr(num){
      if(num<10){
        num = "0" + num;
      }
      return num;
    }

    $rootScope.getTimeStr = function(){
      var _date = new Date();
      var _hour = getDateStr(_date.getHours());
      var _min = getDateStr(_date.getMinutes());
      var _ss = getDateStr(_date.getSeconds());
      return _hour + ":" + _min + ":" + _ss;
    };

    var mySplashScreen = document.getElementById('custom-overlay');
    setTimeout(function(){
      mySplashScreen.className += " hideAnima";
    },2300);

    setTimeout(function(){
      mySplashScreen.style.display = 'none';
    },2600);


    $rootScope.getCurrentDateStr = function(){
      var _date = new Date();
      var _y = _date.getFullYear();
      var _m = getDateStr(_date.getMonth()+1);
      var _d = getDateStr(_date.getDate());
      return _y + "/" + _m + "/" +_d;
      // var _hour = getDateStr(_date.getHours());
      // var _min = getDateStr(_date.getMinutes());
      // var _ss = getDateStr(_date.getSeconds());
      // return _y + "/" + _m + "/" +_d + "-" + _hour + ":" + _min + ":" + _ss;
    };


    $rootScope.getClassKey = function(cid){
      return 'class_' + cid + '_' + $rootScope.getCurrentDateStr();

    };

    // $rootScope.logout = function(){
    //
    //   $state.go('login');
    // };

    $rootScope.logout = function() {

      var servicePopup = $ionicPopup.show({
        title: '提示',
        subTitle: '确认要退出？',
        scope: $rootScope,
        buttons: [
          {
            text: '取消',
            type: 'button-clear button-assertive',
            onTap: function () {
              return 'N';
            }
          },
          {
            text: '确认',
            type: 'button-clear button-assertive border-left',
            onTap: function (e) {
              return 'Y';
            }
          },
        ]
      });
      servicePopup.then(function (res) {

        if (res == 'Y') {

          $rootScope.clearSubmitTimeout();
          $state.go('login');

        }
      });
    };

    $rootScope.goHome = function(){

      if($state.current.name=='app.changepwd'){
        return false;
      }else{
        $state.go('app.home');
      }

    };

    $rootScope.showLoadingToast = function () {
      // Setup the loader
      $ionicLoading.show({
        template: '<ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>',
        content: '',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
    };

    $rootScope.hideLoadingToast = function () {
      $ionicLoading.hide();
    };



    $rootScope.autoConmitQueue = {};

    $rootScope.resetSubmitTimeout = function(key){


      if($rootScope.autoConmitQueue.hasOwnProperty(key)){
        var userName =  $rootScope.autoConmitQueue[key]['userName'];
        var waitTime =  $rootScope.autoConmitQueue[key]['waitTime'];

        if($rootScope.autoConmitQueue[key]['timeOutSubmit']){
          $timeout.cancel($rootScope.autoConmitQueue[key]['timeOutSubmit']);
        }
        $rootScope.autoConmitQueue[classId]['timeOutSubmit'] = $timeout(function(){
          $rootScope.submitClassById(key);
        }, $rootScope.autoConmitQueue[key]['waitTime']);

      }

    };

    $rootScope.deleteSubmitTimeout = function(key){
      if($rootScope.autoConmitQueue.hasOwnProperty(key)){
        if($rootScope.autoConmitQueue[key]['timeOutSubmit']){
          $timeout.cancel($rootScope.autoConmitQueue[key]['timeOutSubmit']);
        }
        delete $rootScope.autoConmitQueue[key];

      }

      var userName  =  $window.sessionStorage.getItem("userName");


      var studInfos = JSON.parse($window.localStorage.getItem(userName + '_classStuInfos'));
      if(studInfos.hasOwnProperty(key)){
        delete studInfos[key];
      }
      $window.localStorage.setItem(userName + '_classStuInfos', JSON.stringify(studInfos));

      var autoConmitStorane = '';
      if($window.sessionStorage.getItem(userName + "_autoConmit")){
        autoConmitStorane = JSON.parse($window.sessionStorage.getItem(userName + "_autoConmit"));
      }
      if(autoConmitStorane && autoConmitStorane.hasOwnProperty(key)) {
        delete autoConmitStorane[key];
        $window.sessionStorage.setItem(userName + "_autoConmit", JSON.stringify(autoConmitStorane));
      }




    };
    $rootScope.clearSubmitTimeout = function(key){

      var userName = '';
      if($window.sessionStorage.getItem("userName")){
        userName = $window.sessionStorage.getItem("userName");
      }
      if(userName){
        if(!key){
          if($rootScope.autoConmitQueue){
            for(var key in $rootScope.autoConmitQueue){
              if($rootScope.autoConmitQueue[key]['timeOutSubmit']){
                $timeout.cancel($rootScope.autoConmitQueue[key]['timeOutSubmit']);
              }
            }
          }

          if($window.sessionStorage.getItem(userName + "_autoConmit")){
            $window.sessionStorage.removeItem(userName + "_autoConmit");
          }
        }else{

          if($rootScope.autoConmitQueue.hasOwnProperty(key)){
            if($rootScope.autoConmitQueue[key]['timeOutSubmit']){
              $timeout.cancel($rootScope.autoConmitQueue[key]['timeOutSubmit']);
            }

          }
        }
      }


    };

    $rootScope.setSubmitTimeout = function(key){


      var autoConmitStorane = '';

      var userName = '';
      if($window.sessionStorage.getItem("userName")){
        userName = $window.sessionStorage.getItem("userName");
      }

      if(userName){
        if($window.sessionStorage.getItem(userName + "_autoConmit")){
          autoConmitStorane = JSON.parse($window.sessionStorage.getItem(userName + "_autoConmit"));
        }
        if(autoConmitStorane && autoConmitStorane.hasOwnProperty(key)){

          // var time = autoConmitStorane[key];
          var time = parseInt(autoConmitStorane[key]);

          // time = 1; // test time
          console.log('time: ', time);

          if($rootScope.autoConmitQueue.hasOwnProperty(key)){
            if($rootScope.autoConmitQueue[key]['timeOutSubmit']){
              $timeout.cancel($rootScope.autoConmitQueue[key]['timeOutSubmit']);
            }
            delete $rootScope.autoConmitQueue[key];
          }



          $rootScope.autoConmitQueue[key] = {
            'userName':userName,
            'waitTime':time*60*1000,
            'timeOutSubmit':null
          };


          $rootScope.autoConmitQueue[key]['timeOutSubmit'] = $timeout(function(){

            $rootScope.submitClassById(key);
          }, $rootScope.autoConmitQueue[key]['waitTime']);
        }
      }


    };







    $rootScope.submitClassById = function(key){




      console.log('submitClassById :', key);

      var userName = '';
      if($window.sessionStorage.getItem("userName")){
        userName = $window.sessionStorage.getItem("userName");
      }
      if(userName){
        var classlst = JSON.parse($window.localStorage.getItem(userName + '_classFinished'));
        // console.log(classlst);
        var csi = JSON.parse($window.localStorage.getItem(userName + '_classStuInfos'));
        // console.log(csi);
        var result = [];
        var newSts = [];
        if(classlst && classlst.length>0){
          for(var i = 0; i<classlst.length; i++){

            var ctemp = classlst[i];

            if(ctemp && ctemp==key){
              // console.log('ctemp :', ctemp);
              var classInfoArr =  ctemp.split("_");
              var cId = classInfoArr[1];
              var cdt = classInfoArr[2];

              var updateTime = csi[ctemp]['updateDate'];
              // if(cId == classId){
              var sts = csi[ctemp]['students'];
              var xxsts = csi[ctemp]['xxStus'];

              for(var j=0; j<sts.length; j++){
                if(sts[j].sign === -1){
                  sts[j].sign = 0;
                }
                var objstu= {

                  "classID":cId,
                  "studentID":sts[j]["studentID"],
                  "sign":sts[j].sign + '',
                  "signTime":updateTime
                };
                newSts.push(objstu);


              }

              for(var k=0; k<xxsts.length; k++){

                var objstu= {

                  "classID":cId,
                  "studentID":xxsts[k]["studentID"],
                  "sign":3,
                  "signTime":updateTime
                };
                newSts.push(objstu);
              }
            }
            // console.log(ctemp, ctemp);


            // }
          }



          if(newSts.length>0){
            Student.setStudentsCallList(newSts).then(function(response){

              if(response.data && response.data.statueCode == "1"){
                $scope.submitResultDone = true;

                $rootScope.dataFrom = 'reload';


                // console.log($window.localStorage.getItem($scope.userName + '_classFinished'));
                var finishedClass = JSON.parse($window.localStorage.getItem(userName + '_classFinished'));
                for(var i=finishedClass.length-1; i>=0; i--){
                  if(finishedClass[i] == key){
                    finishedClass.splice(i, 1);
                  }
                }

                var studInfos = JSON.parse($window.localStorage.getItem(userName + '_classStuInfos'));
                for(var i=0; i<finishedClass.length; i++){
                  delete studInfos[key];
                }

                if(finishedClass.length>0){
                  $window.localStorage.setItem(userName + '_classFinished', JSON.stringify(finishedClass));
                }else{
                  $window.localStorage.removeItem(userName + '_classFinished');
                }


                $window.localStorage.setItem(userName + '_classStuInfos', JSON.stringify(studInfos));

                // $scope.csInfos = null;
                $rootScope.deleteSubmitTimeout(key);




                //数据更新后对各个页面的处理
                //if()
                if($state.current.name == 'app.result'){
                  $rootScope.roloadResultPage();
                }
                if($state.current.name == 'app.home'){
                  $rootScope.roloadHomePage();
                }

              }else{

              }
            }, function(error){

            });
          }



        }
      }

    };


  })
  .controller('LoginCtrl', function($rootScope, $scope, $state,$window, $timeout, $location,$ionicLoading, Login, ENVIRONMENT) {
    // $timeout(function(){
    //   $state.go('app.home');
    // }, 3000);
    // console.log($window);

    $window.history.pushState(null, null,   $window.location.href);
    $rootScope.classCategoryInfos = null;
    $rootScope.currentClassCategoryInfos = [];
    $rootScope.currentTitle = '';
    $rootScope.teacherName = '';
    $rootScope.showTitle = false;
    $rootScope.currentTitle = '';
    $rootScope.showTitle = false;

    $rootScope.smallTitle = 0;

    $rootScope.classInfos = null;
    $scope.loginErrorMessage = false;
    $scope.errorMessage = "";
    $rootScope.classItems = null;
    $rootScope.userName = "";
    $scope.splash = true;

    $scope.user = {
      "username":"",
      "pwd":""
    };



    if(ENVIRONMENT == 'prod'){

      $('.roll_content').height($(window).height());
    }else{

    }

    $scope.doLoginName = function(event){
      // console.log(event);
      // event.stopPropagation();
      if(event.which === 13){
        if($scope.user.username!="" && $scope.user.pwd!=""){
          $scope.login();
        }


      }

    };

    $scope.doLogin = function(event){
      // console.log(event);
      event.stopPropagation();
      if(event.which === 13){
        if($scope.user.username!="" && $scope.user.pwd!=""){
          $scope.login();
        }

      }

    };

    $scope.login = function(){



      $scope.loginErrorMessage = false;
      $scope.errorMessage = '';
      if($scope.user.username==""){
        $scope.errorMessage = "请输入姓名!";
        return false;
      }

      if($scope.user.pwd==""){
        $scope.errorMessage = "请输入密码!";
        return false;
      }







      $rootScope.showLoadingToast();

      Login.login($scope.user.username, $scope.user.pwd).then(function(response){


        //will change
        if(response && response.data && response.data!='0'){



          $scope.errorMessage = "";
          // $rootScope.classInfos = response.data;
          $rootScope.userName = $scope.user.username;
          $rootScope.password = $scope.user.pwd;

          var classData = response.data;


          $rootScope.classCategoryInfos = classData;

          $rootScope.teacherName = classData['tName'];
          // $rootScope.currentClassCategoryInfos = $rootScope.classCategoryInfos['thiSemester'];



          // $window.sessionStorage.setItem($scope.user.username+"_classInfos", JSON.stringify(response.data));
          $window.sessionStorage.setItem($scope.user.username+"_classInfos", JSON.stringify(classData['thiSemester']));
          $window.sessionStorage.setItem("userName", $scope.user.username);
          $window.sessionStorage.setItem("password", $scope.user.pwd);

          // console.log($rootScope.userName,  $rootScope.password);
          if($rootScope.classCategoryInfos){

            $state.go('app.home');
          }
        }else{

          $scope.errorMessage = "用户名或者密码不匹配";
          $rootScope.classInfos = null;

        }
        $rootScope.hideLoadingToast();

      },function(error){
        $rootScope.classInfos = null;
        $scope.errorMessage = "用户名或者密码不匹配";
        $rootScope.hideLoadingToast();
      });




    };

    $scope.setErrorMessageEmpty = function(){
      $scope.errorMessage = '';
    };
    $scope.goChangePwd = function(){

      $state.go('app.changepwd');
    };

    //$location.path('app/home');

  })




  .controller('HomeCtrl', function($rootScope, $scope, $ionicPopup, $timeout, $window, $state, Login, Student) {

    $window.history.forward(1);

    // console.log($state);

    $rootScope.currentTitle = '';
    $rootScope.showTitle = false;

    $rootScope.smallTitle = 0;

    $scope.reLoadData = false;

    if($rootScope.dataFrom = 'reload'){
      $scope.reLoadData = true;

      $rootScope.dataFrom = '';
    }



    $scope.haveListContent = '0';
    $scope.userName =  $window.sessionStorage.getItem("userName");
    $scope.pwd =  $window.sessionStorage.getItem("password");
    $scope.currentActiveItem = null;

    $scope.classItems = [];


    $scope.reLoadDataFunc = function(){
      $rootScope.showLoadingToast();

      Login.login($scope.userName, $scope.pwd).then(function(response){


        if(response && response.data && response.data.length!=0){

          var classData = response.data;

          $rootScope.classCategoryInfos = classData;

          var currentclassItems = $rootScope.classCategoryInfos['thiSemester'];


          $scope.classItems =  [];
          for(var i=0; i<currentclassItems.length; i++){
            if(currentclassItems[i]['delFlg']=='0'){
              $scope.classItems.push(currentclassItems[i]);
            }
          }
          if($scope.classItems && $scope.classItems.length>0){
            $scope.haveListContent = '1';
          }else{
            $scope.haveListContent = '2';
          }

          $window.sessionStorage.setItem($scope.userName + "_classInfos", JSON.stringify(classData['thiSemester']));
          //$window.sessionStorage.setItem("classInfos", response.data);

          // $scope.classItems = $rootScope.classCategoryInfos['thiSemester'];
          // if( $scope.classItems.length>0){
          //   $scope.haveListContent = true;
          // }

          initOtherPart();
          //console.log($rootScope.userName,  $rootScope.password);
          //if($rootScope.classInfos.length>0){
          //
          //}
        }else{
          $rootScope.classCategoryInfos = null;
          $scope.haveListContent = false;
        }
        $rootScope.hideLoadingToast();

      },function(error){
        $scope.haveListContent = false;
        $rootScope.classCategoryInfos = null;
        $scope.errorMessage = "用户名或密码有误或没有课程!";
        $rootScope.hideLoadingToast();
      });
    }
    if($scope.reLoadData){
      $scope.reLoadDataFunc();

    }else{
      var currentclassItems  =  [];
      if($rootScope.classCategoryInfos && $rootScope.classCategoryInfos.hasOwnProperty('thiSemester')){
        var currentclassItems = $rootScope.classCategoryInfos['thiSemester'];



        for(var i=0; i<currentclassItems.length; i++){
          if(currentclassItems[i]['delFlg']=='0'){
            $scope.classItems.push(currentclassItems[i]);
          }
        }
      }


      if($scope.classItems && $scope.classItems.length>0){
        $scope.haveListContent = '1';
      }else{
        $scope.haveListContent = '2';
      }

      initOtherPart();
    }




    $rootScope.roloadHomePage = function(){
      $scope.reLoadDataFunc();
    };




    $scope.changeSignType = function(stype){
      $rootScope.signSelectedType = stype;
    };




    $scope.showWarning = function(){

      var servicePopup = $ionicPopup.show({
        title: '提示',
        subTitle: '超过上限，今天内不能再点名了!',
        scope: $rootScope,
        buttons: [
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

      });
    };



    // initOtherPart();
    function initOtherPart(){
      var classlst = $window.localStorage.getItem($scope.userName + '_classFinished');

      if(classlst){
        classlst = JSON.parse(classlst);
        for(var i=0; i<$scope.classItems.length; i++){
          var ckey = $rootScope.getClassKey($scope.classItems[i]['classID']);

          if(classlst.indexOf(ckey)!=-1){
            $scope.classItems[i]['exist'] = true;
            $scope.classItems[i]['ckey'] = ckey;
          }else{
            $scope.classItems[i]['exist'] = false;
            $scope.classItems[i]['ckey'] = ckey;
          }
        }
      }else{
        for(var i=0; i<$scope.classItems.length; i++){
          var ckey = $rootScope.getClassKey($scope.classItems[i]['classID']);
          $scope.classItems[i]['exist'] = false;
          $scope.classItems[i]['ckey'] = ckey;
        }

      }

    }


    $scope.gotoNextPage = function(item){

      if($rootScope.signSelectedType == 1){
        if(item.exist){
          $state.go('app.result', {id:item.ckey});
        }else{




          Student.checkConmitTimes(item.classID).then(function(response){

             if(response && response['data'] && response['data'].hasOwnProperty('autoConmit')){
               var autoConmit = response['data']['autoConmit'];


               var autoConmitTime = 0;
               if(autoConmit==1){
                 autoConmitTime = response.data['autoConmitTime'];

                 var autoConmitStorane = {};
                 if($window.sessionStorage.getItem($scope.userName + "_autoConmit")){
                   autoConmitStorane = JSON.parse($window.sessionStorage.getItem($scope.userName + "_autoConmit"));
                 }

                 autoConmitStorane[item.ckey] = autoConmitTime;

                 $window.sessionStorage.setItem($scope.userName + "_autoConmit", JSON.stringify(autoConmitStorane));


               }else{

                 if($window.sessionStorage.getItem($scope.userName + "_autoConmit")){
                   var autoConmitStorane = JSON.parse($window.sessionStorage.getItem($scope.userName + "_autoConmit"));
                   if(autoConmitStorane.hasOwnProperty(item.ckey)){
                     delete autoConmitStorane[item.ckey];

                     $window.sessionStorage.setItem($scope.userName + "_autoConmit", JSON.stringify(autoConmitStorane));
                   }
                 }

               }


               $state.go('app.signlist', {id:item.ckey});

               //$window.sessionStorage.settem("userName");
             }else{

               if($window.sessionStorage.getItem($scope.userName + "_autoConmit")){
                 var autoConmitStorane = JSON.parse($window.sessionStorage.getItem($scope.userName + "_autoConmit"));
                 if(autoConmitStorane.hasOwnProperty(item.ckey)){
                   delete autoConmitStorane[item.ckey];

                   $window.sessionStorage.setItem($scope.userName + "_autoConmit", JSON.stringify(autoConmitStorane));
                 }
               }

               $scope.showWarning();


             }
            },
            function(error){

            });

        }
      }else if($rootScope.signSelectedType == 2){


        if(item.exist){
          $state.go('app.result', {id:item.ckey});

        }else{

          $scope.currentActiveItem = item;


          var ckey2 = $rootScope.getClassKey($scope.currentActiveItem['classID']);
          var classStuInfos = {};
          var classStuInfosObj = $window.localStorage.getItem($scope.userName + '_classStuInfos');


          if(classStuInfosObj){
            classStuInfos = JSON.parse(classStuInfosObj);

          }

          if(classStuInfos.hasOwnProperty(ckey2)){


            $scope.showConfirm();

          }else{

            Student.checkConmitTimes(item.classID).then(function(response){
              // console.log('checkConmitTimes');
              // console.log(response);
                if(response && response.data && response.data.hasOwnProperty('autoConmit')){
                  var autoConmit = response.data['autoConmit'];
                  var autoConmitTime = 0;
                  if(autoConmit=='1'){

                    // console.log('autoConmit :', autoConmit);
                    autoConmitTime = response.data['autoConmitTime'];
                    var autoConmitStorane = null;
                    if($window.sessionStorage.getItem($scope.userName + "_autoConmit")){
                      autoConmitStorane = JSON.parse($window.sessionStorage.getItem($scope.userName + "_autoConmit"));
                    }else{
                      autoConmitStorane = {};
                    }

                    autoConmitStorane[item.ckey] = autoConmitTime;


                    $window.sessionStorage.setItem($scope.userName + "_autoConmit", JSON.stringify(autoConmitStorane))

                  }else{

                    if($window.sessionStorage.getItem($scope.userName + "_autoConmit")){
                      var autoConmitStorane = JSON.parse($window.sessionStorage.getItem($scope.userName + "_autoConmit"));
                      if(autoConmitStorane && autoConmitStorane.hasOwnProperty(item.ckey)){
                        delete autoConmitStorane[item.ckey];

                        $window.sessionStorage.setItem($scope.userName + "_autoConmit", JSON.stringify(autoConmitStorane));
                      }
                    }

                  }


                  $scope.currentActiveItem = null;
                  $scope.batchSignStudents(item);

                  //$window.sessionStorage.settem("userName");
                }else{

                  if($window.sessionStorage.getItem($scope.userName + "_autoConmit")){
                    var autoConmitStorane = JSON.parse($window.sessionStorage.getItem($scope.userName + "_autoConmit"));
                    if(autoConmitStorane.hasOwnProperty(item.ckey)){
                      delete autoConmitStorane[item.ckey];

                      $window.sessionStorage.setItem($scope.userName + "_autoConmit", JSON.stringify(autoConmitStorane));
                    }
                  }

                  $scope.showWarning();


                }
              },
              function(error){

              });



          }




        }
      }

    };

    $scope.checkClassState = function(){

    };
    var nh = 0;
    $scope.$watch('$viewContentLoaded',function(){

      //  var oh = $('#main-view').height();
      //  var sht = $('#home_top').height();
      // nh = oh - sht-30;





    });



    $scope.showConfirm = function(){

      var servicePopup = $ionicPopup.show({
        title: '提示',
        subTitle: '此课程已经进行常规点名，并未完成，确认进行批量点名，并丢弃之前数据么？',
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

          $scope.batchSignStudents($scope.currentActiveItem);

        }
      });
    };

    $scope.batchSignStudents = function(item){

      $rootScope.showLoadingToast();
      var keyArr = item.ckey.split('_');
      var dt = keyArr[2];

      Student.getStudentsList(item.classID).then(function(response){

        $rootScope.hideLoadingToast();
        if(response && response.data &&  response.data!="false"){


          var qdStus = [],
            xxStus = []; // qdStus 需要签到的学生， xxStus 休学的学生

          var stus = response.data;

          for(var i=0; i<stus.length; i++){
            if(stus[i]['suspendOS']=='1'){
              xxStus.push(stus[i]);

            }else{
              qdStus.push(stus[i]);
            }
          }

          var students = qdStus.sort(function(a, b){
            if(a.studentID < b.studentID){
              return -1;
            }else{
              return 1;
            }
          });

          for(var i=0; i<students.length; i++){
            students[i]['sign'] = 0;
          }



          var obj = {
            "classID":item.classID,
            "className":item.className,
            "updateDate":dt + ' ' + $rootScope.getTimeStr(),
            "students":students,
            "xxStus":xxStus,
            "currentIdx":students.length-1

          };

          var classStuInfos = {};

          var classStuInfosObj = $window.localStorage.getItem($scope.userName + '_classStuInfos');


          if(classStuInfosObj){
            classStuInfos = JSON.parse(classStuInfosObj);
          }

          classStuInfos[item.ckey] = obj;
          var jsonStr = JSON.stringify(classStuInfos);
          // console.log(jsonStr);
          $window.localStorage.setItem($scope.userName + '_classStuInfos', jsonStr);

          var classFinished = [];
          var classFinishedObj = $window.localStorage.getItem($scope.userName + '_classFinished');
          if(classFinishedObj){
            classFinished = JSON.parse(classFinishedObj);
          }
          if(classFinished.indexOf(item.ckey)==-1){
            classFinished.push(item.ckey);
          }
          var jsonFinishStr = JSON.stringify(classFinished);

          $window.localStorage.setItem($scope.userName + '_classFinished', jsonFinishStr);

          // console.log(item.ckey);

          // add result

          // console.log(11111);
          $rootScope.setSubmitTimeout(item.ckey);


          //item.classID


          $state.go('app.result', {id:item.ckey});

        }



      }, function(error){
        $rootScope.hideLoadingToast();
      });
    };



    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
      // console.log('ngRepeatFinished');
      $timeout(function(){
        // $('#scroll_list').height(nh);
        $('#scroll_list').niceScroll({cursorcolor:"#732729", cursorwidth:"6px", autohidemode:false});
      }, 1000);
    });

    $scope.gotoHistorySearch = function(){
      $state.go('app.selecthistory');
    }

  })

  .controller('SignListCtrl', function($rootScope,  $scope,$ionicPopup, $timeout, $state, $window, $ionicLoading, $stateParams,Student) {
    // console.log('SignListCtrl');


    $rootScope.smallTitle = 0;
    $scope.classKey =  $stateParams.id;
    // console.log('$scope.classKey : ', $scope.classKey);
    var keyArr = $scope.classKey.split('_');
    $scope.dt = keyArr[2];
    $scope.classID = keyArr[1];
    // console.log('SignListCtrl $scope.classID :', $scope.classID);
    $scope.students = null;
    $scope.currentIndex = 0;
    $scope.isStudentAnimating = false;
    $scope.isFirstItem = true;
    $scope.isLastItem = false;
    $scope.passSignNum = 0;
    $scope.currentVal = -1;
    $scope.className = '';
    $scope.userName =  $window.sessionStorage.getItem("userName");
    $scope.classItems = JSON.parse($window.sessionStorage.getItem($scope.userName + "_classInfos"));


    var classStuInfos = {};
    var classStuInfosObj = $window.localStorage.getItem($scope.userName + '_classStuInfos');




    if(classStuInfosObj){
      classStuInfos = JSON.parse(classStuInfosObj);
    }

    var ckey = $rootScope.getClassKey($scope.classID);

    // console.log("ckey :", ckey);



    $scope.showConfirm2 = function(){
      // console.log('aaa');
      var servicePopup = $ionicPopup.show({
        title: '提示',
        subTitle: '确认返回并丢弃当前操作么？',
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
        //console.log(res);
        if (res == 'active') {
          // console.log(ckey);
          if(classStuInfos && classStuInfos[ckey]){

            delete classStuInfos[ckey];
            $window.localStorage.setItem($scope.userName + '_classStuInfos', JSON.stringify(classStuInfos));
            // console.log(classStuInfos);
            $state.go('app.home');
          }
          //console.log('---active');
          // 退出app
          //ionic.Platform.exitApp();
        }
      });
    };


    // console.log('SignListCtrlSignListCtrl ckey: ', ckey);

    $rootScope.currentTitle = $rootScope.teacherName;
    $rootScope.showTitle = true;
    if(classStuInfos && classStuInfos[ckey]){


      $scope.students = classStuInfos[ckey]['students'];
      $scope.currentIndex = classStuInfos[ckey]['currentIdx'];
      $scope.passSignNum =classStuInfos[ckey]['currentIdx'];
      $scope.currentVal = -1;
      $scope.className = classStuInfos[ckey]['className'];
      $rootScope.currentTitle = $scope.className;


    }


    if($scope.students){


      $scope.passSignNum = $scope.passSignNum + 1;

      initSignList($scope.passSignNum);

    }else{

      Student.getStudentsList($scope.classID).then(function(response){



        if(response && response.data &&  response.data!="false"){


          var qdStus = [],
            xxStus = []; // qdStus 需要签到的学生， xxStus 休学的学生

          var stus = response.data;

          for(var i=0; i<stus.length; i++){
            if(stus[i]['suspendOS']=='1'){
              xxStus.push(stus[i]);

            }else{
              qdStus.push(stus[i]);
            }
          }

          $scope.students = qdStus.sort(function(a, b){
            if(a.studentID < b.studentID){
              return -1;
            }else{
              return 1;
            }
          });

          for(var i=0; i<$scope.students.length; i++){
            $scope.students[i]['sign'] = -1;
          }
          $scope.currentIndex = 0;

          for(var i=0; i<$scope.classItems.length;i++){
            if($scope.classItems[i].classID == $scope.classID){
              $scope.className = $scope.classItems[i].className;
              $rootScope.currentTitle = $scope.className;
            }
          }



          var obj = {
            "classID":$scope.classID,
            "className":$scope.className,
            "updateDate":$scope.dt + ' ' + $rootScope.getTimeStr(),
            "students":$scope.students,
            "xxStus":xxStus,
            "currentIdx": -1

          };

          classStuInfos[ckey] = obj;
          var jsonStr = JSON.stringify(classStuInfos);
          // console.log(jsonStr);
          $window.localStorage.setItem($scope.userName + '_classStuInfos', jsonStr);
          initSignList();


        }



      }, function(error){

      });
    }



    $scope.nextStudent = function(){


      if(!$scope.isStudentAnimating){
        $scope.isStudentAnimating = true;
        var owl = $("#person_name_list").data('owlCarousel');

        if($scope.students[owl.currentItem]['sign']==-1){
          setItemSign(owl.currentItem, 0);
        }


        owl.next();
        if($scope.passSignNum<owl.currentItem){
          $scope.passSignNum = owl.currentItem;
        }


        $scope.currentIndex = owl.currentItem;


        $scope.currentVal = $scope.students[owl.currentItem]['sign'];

        changeControllerBtnVisible();

        $timeout(function(){
          $scope.isStudentAnimating= false;
        }, 400);

      }


    };

    $scope.prevStudent = function(){

      if(!$scope.isStudentAnimating){
        $scope.isStudentAnimating = true;
        var owl = $("#person_name_list").data('owlCarousel');

        owl.prev();

        $scope.currentIndex = owl.currentItem;
        $scope.currentVal = $scope.students[owl.currentItem]['sign'];

        changeControllerBtnVisible();

        $timeout(function(){
          $scope.isStudentAnimating= false;
        }, 400);

      }
    };


    $scope.setSignSwitch = false;

    $scope.setSign = function(val){

      if(!$scope.setSignSwitch){
        $scope.setSignSwitch = true;
        $scope.currentVal = val;
        // console.log('$scope.currentIndex', $scope.currentIndex);
        setItemSign($scope.currentIndex, val);
        if($scope.currentIndex < ($scope.students.length-1)){
          $timeout(function(){
            $scope.nextStudent();
          }, 100);
          $timeout(function(){
            $scope.setSignSwitch = false;
          }, 550);
        }else{
          $scope.passSignNum = $scope.students.length;
          $timeout(function(){
            $scope.setSignSwitch = false;
          }, 100);
          //   $window.localStorage.setItem('classStuInfos', jsonStr);
          var classlst = $window.localStorage.getItem($scope.userName + '_classFinished');
          if(classlst){
            classlst = JSON.parse(classlst);
          }else{
            classlst = [];
          }

          var ckey = $rootScope.getClassKey($scope.classID);
          if(classlst.indexOf(ckey)==-1){

            classlst.push(ckey);
            $window.localStorage.setItem($scope.userName + '_classFinished', JSON.stringify(classlst));
          }



          // console.log('finished');
          $timeout(function(){
            $state.go('app.signstate', {id:ckey});
          }, 400);


        }
      }




    };

    function setItemSign(index, val){
      //console.log(index);
      // console.log('setItemSign');
      // console.log(index, val);
      $scope.students[index]['sign'] = val;
      // console.log('setItemSign :', val);

      var temp = JSON.parse($window.localStorage.getItem($scope.userName + '_classStuInfos'));

      temp[ckey].students[index]['sign'] = val;
      //if($scope.currentIndex == index){
      // console.log('$scope.passSignNum :', $scope.passSignNum);
      temp[ckey]['currentIdx'] = $scope.passSignNum;
      // }
      var jsonStr = JSON.stringify(temp);
      //console.log(jsonStr);
      $window.localStorage.setItem($scope.userName + '_classStuInfos', jsonStr);
    }

    function getItemSign(index){

    }

    function changeControllerBtnVisible(){

      $timeout(function(){
        if($scope.currentIndex == 0){
          $scope.isFirstItem = true;

        }else{
          $scope.isFirstItem = false;

        }
        if($scope.currentIndex == $scope.students.length-1){
          $scope.isLastItem = true;
        }else{
          $scope.isLastItem = false;
        }

        // console.log($scope.isFirstItem, $scope.isLastItem);
      }, 0);


    }
    function initSignList(index){

      var options = {autoPlay: false, pagination:false, autoHeight:true, touchDrag:false, mouseDrag:false, slideSpeed : 300,paginationSpeed : 300, items:1, singleItem:true};

      $timeout(function(){
        $('#person_name_list').owlCarousel(options);
        if(index && index!=0){

          $scope.currentIndex = index;
          $scope.passSignNum = index;

          $timeout(function(){
            var owl = $("#person_name_list").data('owlCarousel');

            // console.log('index : ', index);
            owl.goTo(index);
          }, 100);


          $scope.currentIndex = index;
          changeControllerBtnVisible();
        }else{
          index = 0;
          $timeout(function(){
            var owl = $("#person_name_list").data('owlCarousel');

            owl.goTo(index);
            $scope.currentIndex = index;
          }, 100);

        }

      },300);
      $scope.gohome = function(){
        $state.go('app.home');
      }
    }

    // $timeout(function(){
    //   $ionicLoading.hide();
    // },2000);
    // $scope.persionst = "\u6c11\u65cf\u4e50\u5668\u6f14\u594f";



    $scope.gostate = function(){
      $state.go('app.signstate');
    }




  })
  .controller('DetailCtrl', function($rootScope,$scope) {
    $scope.$watch('$viewContentLoaded',function(){
      // 初始化地图
      // console.log('DetailCtrl');

    });
  })
  .controller('SignStateCtrl', function($scope, $timeout,$state ,$stateParams,$window, $rootScope, ENVIRONMENT) {
    // console.log('SignStateCtrl');



    $rootScope.currentTitle = '';
    $rootScope.showTitle = false;
    $rootScope.smallTitle = 2;
    // $scope.currentTabIndex = '准到';
    // $scope.currentTabIndex = '迟到';
    // $scope.currentTabIndex = '旷课';
    $scope.currentTabType = '1';

    // $scope.cid = $stateParams.cid;
    // $scope.ctime = $stateParams.ctime;



    $scope.studentsList = [];
    $scope.cdList = [];
    $scope.zdList = [];
    $scope.kkList = [];


    $scope.ckey = $stateParams.id;
    // console.log($scope.classID);
    $scope.className = '';
    $scope.students = null;
    $scope.searchTxt = '';
    $scope.dataLoaded = false;
    // $scope.signYesActive = false;
    // $scope.signNoActive = true;
    // $scope.signtype = 2;

    $scope.searchResult = {
      cdListHasResult:-1,
      zdListHasResult:-1,
      kkListHasResult:-1
    };
    $scope.searchObj = {
      searchTxt:''
    }

    // $scope.getSearchText = function(){
    //   return $scope.searchTxt
    // };

    // $scope.$watch(function($scope) { return $scope.searchTxt; },
    //   function(newValue, oldValue, scope) {
    //     console.log(newValue, oldValue);
    //   });

    function filterListResult(list, text){
      if(!text || text==''){
        return -1;
      }
      if(!list || list=='' || list.length==0){
        return 0;
      }

      var result = 0;
      for(var i=0; i<list.length; i++){
        if(list[i]['stuName'].toLowerCase().indexOf(text.toLowerCase())!=-1){
          result = 1;
          break;
        }
      }
      return result;
    }

    $scope.$watch('searchObj',function(newValue,oldValue){
      if(!newValue || newValue==''){
        $scope.searchResult.cdListHasResult = -1;
        $scope.searchResult.zdListHasResult = -1;
        $scope.searchResult.kkListHasResult = -1;
      }else{
        $scope.searchResult.cdListHasResult = filterListResult($scope.cdList, newValue.searchTxt);
        $scope.searchResult.zdListHasResult = filterListResult($scope.zdList, newValue.searchTxt);
        $scope.searchResult.kkListHasResult = filterListResult($scope.kkList, newValue.searchTxt);
      }
      // console.log($scope.searchResult);

    }, true);

    $scope.userName =  $window.sessionStorage.getItem("userName");
    var csi = JSON.parse($window.localStorage.getItem($scope.userName + '_classStuInfos'));
    // var key = $rootScope.getClassKey($scope.classID);
    $scope.students = csi[$scope.ckey]['students'];


    for(var i=0; i< $scope.students.length; i++){
      if($scope.students[i]['sign']=='1'){
        $scope.cdList.push($scope.students[i]);
      }else if($scope.students[i]['sign']=='0'){
        $scope.zdList.push($scope.students[i]);
      }else{
        $scope.kkList.push($scope.students[i]);
      }
    }
    $scope.dataLoaded = true;

    $scope.className = csi[$scope.ckey]['className'];

    // console.log($scope.students);

    $scope.goDetailPage = function(cid, sid){
      $state.go('app.detail', {cid:cid, sid:sid});
    };


    $scope.changeCurrentStatus = function(status){
      $scope.currentTabType = status;


    };

    $scope.$watch('$viewContentLoaded',function(){
      // 初始化地图

      if(ENVIRONMENT == 'prod'){
        // console.log('prod');
        $('#roll_content_status').height($(window).height());
      }else{
        // console.log('test');
      }


    });



    $scope.goResult = function(){
      // add result
      $rootScope.setSubmitTimeout($scope.ckey);
      $state.go('app.result');
    }
  })

  .controller('signSingleCtrl', function($rootScope, $scope, $timeout,$state ,$stateParams,$window) {
    // console.log('signSingleCtrl');

    $rootScope.showTitle = true;
    $rootScope.smallTitle = 0;


    $scope.ckey = $stateParams.cid;
    $scope.stuID = $stateParams.sid;
    $scope.stu = null;
    $scope.currentVal = 0;
    $scope.className = '';
    $scope.userName =  $window.sessionStorage.getItem("userName");
    var csi = JSON.parse($window.localStorage.getItem($scope.userName + '_classStuInfos'));
    //var key = $rootScope.getClassKey($scope.classID);
    // console.log(csi);
    // $rootScope.currentTitle = csi[$scope.ckey];

    var stus = csi[$scope.ckey]['students'];
    $rootScope.currentTitle = csi[$scope.ckey]['className'];

    // console.log();
    for(var i=0; i<stus.length; i++){
      if(stus[i].studentID == $scope.stuID){
        $scope.stu = stus[i];
        $scope.currentVal = $scope.stu.sign;

        break;
      }

    }
    // console.log('-----------  ');
    // console.log($scope.stu);
    // console.log( $scope.currentVal);

    // console.log(csi);
    $scope.setSign = function(val){
      if($scope.currentVal!=val){
        $scope.currentVal = val;
        for(var i=0; i<stus.length; i++){
          if(stus[i].studentID == $scope.stuID){
            $scope.stu.sign = val;
            break;
          }

        }
        $window.localStorage.setItem($scope.userName + '_classStuInfos', JSON.stringify(csi))


      }
      $timeout(function(){
        $state.go('app.signstate', {id:$scope.ckey});
      }, 500);


    }






  })

  .controller('ResultCtrl', function($rootScope, $scope, $state, $ionicPopup,$window, $ionicLoading, $timeout, Student) {
    $scope.csInfos = [];
    $rootScope.currentTitle = '结果一览';
    $rootScope.showTitle = true;
    $rootScope.smallTitle = 0;
    $rootScope.dataFrom = '';

    $scope.submitResultDone = false;
    $scope.showContent = true;
    $scope.remindMessage = '';

    $scope.resultMessage = '';
    $scope.userName =  $window.sessionStorage.getItem("userName");
    var fcs = [];
    var csi = null;

    function initCsInfos(){
      $scope.csInfos = [];
      var fcsArr = $window.localStorage.getItem($scope.userName + '_classFinished');
      // var autoConmitStorane = JSON.parse($window.sessionStorage.getItem($scope.userName + "_autoConmit"));


      if(fcsArr){
        fcs = JSON.parse(fcsArr);
        csi = JSON.parse($window.localStorage.getItem($scope.userName + '_classStuInfos'));
        for(var i=0; i<fcs.length; i++){
          var obj = {
            "id" : fcs[i],
            "className" : csi[fcs[i]]['className'],
            "updateDate" : csi[fcs[i]]['updateDate']
          };
          $scope.csInfos.push(obj);

          // if(autoConmitStorane.hasOwnProperty(fcs[i])){
          //   var classId = '';
          //   //$rootScope.autoConmitQueue
          // }
        }

      }


    }
    initCsInfos();

    $scope.gotoStatePate = function(id){

      $rootScope.clearSubmitTimeout(id);
      $state.go('app.signstate',{id:id});
    };

    $scope.goHome = function(id){
      $state.go('app.home');
    };

    function deleteClassItem(skey){
      for(var i=fcs.length-1; i>=0; i--){
        if(fcs[i] == skey){
          fcs.splice(i,1);
          break;
        }
      }
      delete csi[skey];

      if(fcs.length == 0){
        $scope.resultMessage = '您的课程已清空!';
        $window.localStorage.removeItem($scope.userName + '_classFinished');
        $window.localStorage.removeItem($scope.userName + '_classStuInfos');
      }else{
        $window.localStorage.setItem($scope.userName + '_classFinished', JSON.stringify(fcs));
        $window.localStorage.setItem($scope.userName + '_classStuInfos', JSON.stringify(csi));
      }
    }


    $scope.showConfirm = function(skey){
      //console.log('aaa');
      event.preventDefault();
      event.stopPropagation();
      var servicePopup2 = $ionicPopup.show({
        title: '提示',
        subTitle: '确定删除该条信息么？',
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
      servicePopup2.then(function (res) {
        //console.log(res);
        if (res == 'active') {
          // console.log(skey);
          deleteClassItem(skey);
          initCsInfos();
        }
      });
    };






    $rootScope.roloadResultPage = function(){
      initCsInfos();

      // $scope.csInfos = null;

      console.log('$scope.csInfos');
      console.log($scope.csInfos);
      $scope.resultMessage = '课程提交成功!';
    };

    $scope.submitLocalStorage = function(){
      var classlst = JSON.parse($window.localStorage.getItem($scope.userName + '_classFinished'));
      // console.log(classlst);
      var csi = JSON.parse($window.localStorage.getItem($scope.userName + '_classStuInfos'));
      // console.log(csi);
      var result = [];
      var newSts = [];
      if(classlst && classlst.length>0){
        for(var i = 0; i<classlst.length; i++){
          var ctemp = classlst[i];

          // console.log('ctemp :', ctemp);
          var classInfoArr =  ctemp.split("_");
          var cId = classInfoArr[1];
          var cdt = classInfoArr[2];
          // console.log(ctemp, ctemp);
          var updateTime = csi[ctemp]['updateDate'];

          var sts = csi[ctemp]['students'];
          var xxsts = csi[ctemp]['xxStus'];

          for(var j=0; j<sts.length; j++){

            var objstu= {

              "classID":cId,
              "studentID":sts[j]["studentID"],
              "sign":sts[j].sign + '',
              "signTime":updateTime
            };
            newSts.push(objstu);


          }

          for(var k=0; k<xxsts.length; k++){

            var objstu= {

              "classID":cId,
              "studentID":xxsts[k]["studentID"],
              "sign":"3",
              "signTime":updateTime
            };
            newSts.push(objstu);


          }


        }

        // console.log(newSts);
        //
        // return;

        $ionicLoading.show({
          template: '<ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner><br ><span style="color:#732729;">正在上传信息，请勿断开连接...</span>',
          content: '',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });



        // console.log('ssss');
        // console.log(JSON.stringify(newSts));

        // return;
        Student.setStudentsCallList(newSts).then(function(response){

          $ionicLoading.hide(response);
          // console.log(response);
          if(response.data && response.data.statueCode == "1"){
            $scope.submitResultDone = true;

            $rootScope.dataFrom = 'reload';


            // console.log($window.localStorage.getItem($scope.userName + '_classFinished'));
            var finishedClass = JSON.parse($window.localStorage.getItem($scope.userName + '_classFinished'));

            var studInfos = JSON.parse($window.localStorage.getItem($scope.userName + '_classStuInfos'));
            for(var i=0; i<finishedClass.length; i++){
              delete studInfos[finishedClass[i]];
            }


            $window.localStorage.removeItem($scope.userName + '_classFinished');

            $window.localStorage.setItem($scope.userName + '_classStuInfos', JSON.stringify(studInfos));

            if($rootScope.autoConmitQueue){
              for(var key in $rootScope.autoConmitQueue){
                if($rootScope.autoConmitQueue[key]['timeOutSubmit']){
                  $timeout.cancel($rootScope.autoConmitQueue[key]['timeOutSubmit']);
                }
              }
            }
            $rootScope.autoConmitQueue = {};
            $window.sessionStorage.removeItem($scope.userName + '_autoConmit');

            // $window.sessionStorage.removeItem($scope.userName + "_classInfos");
            $scope.csInfos = null;
            $scope.resultMessage = '课程提交成功!';


            ;
          }else{
            $scope.submitResultDone = false;
            // $scope.resultMessage = '课程提交失败, 请稍后再试。';
            $scope.resultMessage = '课程提交失败, 请稍后再试。';
          }
        }, function(error){
          $scope.submitResultDone = false;
          $scope.resultMessage = '服务器正忙, 请稍后再试。';
          console.log(error);
          $ionicLoading.hide();
        });

        // $timeout(function(){
        //   $ionicLoading.hide();
        // }, 5000);

      }
    };

  })

  .controller('ChangePwdCtrl', function($rootScope, $scope,$state, $timeout, Login, ENVIRONMENT) {

    $rootScope.currentTitle = '修改密码';
    $rootScope.showTitle = true;
    $rootScope.smallTitle = 0;

    $scope.user = {
      "username" : '',
      "oldPwd" : '',
      "newPwd" : '',
      "newPwd2": ''
    };


    //change height
    // console.log("window height: ", $(window).height());
    if(ENVIRONMENT == 'prod'){
      // console.log('prod');
      $('.roll_content').height($(window).height());
    }else{
      // console.log('test');
    }
    // $('.roll_content').height($(window).height());

    $scope.$watch('user',function(newValue,oldValue, scope){
      $scope.errorMessage = "";
    }, true);
    $scope.errorMessage = '';
    $scope.successMessage = '';

    $scope.changePassWord = function(){
      $scope.errorMessage = "";
      if($scope.user.username==''){
        $scope.errorMessage = "请输入用户名";
        return false;
      }

      if($scope.user.oldPwd==''){
        $scope.errorMessage = "请输入原登录密码";
        return false;
      }

      if($scope.user.newPwd==''){
        $scope.errorMessage = "请输入新登录密码";
        return false;
      }

      // if($scope.user.newPwd.length<4){
      //   $scope.errorMessage = "新登录密码最少4位";
      //   return false;
      // }
      if($scope.user.newPwd== $scope.user.oldPwd){
        $scope.errorMessage = "新密码不能与原密码一样";
        return false;
      }

      if($scope.user.newPwd2==''){
        $scope.errorMessage = "请输入确认新密码";
        return false;
      }

      if($scope.user.newPwd!=$scope.user.newPwd2){
        $scope.errorMessage = "新密码与确认密码不一致";
        return false;
      }
      $rootScope.showLoadingToast();

      Login.changePwd($scope.user.username,$scope.user.oldPwd, $scope.user.newPwd).then(function(response){
        // console.log(response);
        $rootScope.hideLoadingToast();
        if(response.data == 1){
          $scope.successMessage = '密码修改成功, 3秒后自动返回登录页面';
          $timeout(function(){
            $scope.successMessage = '';
            $state.go('login');
          }, 3000);


        }else{
          $scope.errorMessage = " 用户名或者原登录密码不匹配!";
        }

      }, function(error){
        $rootScope.hideLoadingToast();
        console.log(error);
        $scope.errorMessage = "服务器忙,请稍后再试!";
      });


    };
    $scope.$watch('$viewContentLoaded',function(){
      // 初始化地图

      // console.log($('#home_content').height());
      // console.log($(window).height());
    });
  })

  .controller('HistoryCtrl', function($rootScope, $scope, $state, $ionicPopup,$window, $ionicLoading, $timeout, Student) {

    $rootScope.currentTitle = '结果一览';
    $rootScope.showTitle = true;
    $rootScope.smallTitle = 0;




  })
  .controller('HistoryCategoryCtrl', function($rootScope, $scope, $state, $ionicPopup,$window, $ionicLoading, $timeout, Student) {

    $rootScope.currentTitle = '';
    $rootScope.showTitle = false;
    $rootScope.smallTitle = 0;

    $scope.historyCurrentItem = $rootScope.selectedItem;

    // console.log('HistoryCategoryCtrl');
    // console.log($scope.historyCurrentItem);

    $('#category_c_list').niceScroll({cursorcolor:"#d5d5d5",cursorborder:"1px solid transparent", cursorwidth:"9px", autohidemode:false});


    $scope.goSearchHistory = function(){
      $state.go('app.selecthistory');
    }

    $scope.goHistoryDetail = function(cid, time){

      $state.go('app.historydetail', {cid:cid, ctime:time});
    }


  })

  .controller('SearchHistoryCtrl', function($rootScope, $scope, $state, $ionicPopup,$window, $ionicLoading, $timeout, Student) {

    $rootScope.currentTitle = '';
    $rootScope.showTitle = false;
    $rootScope.smallTitle = 0;
    $rootScope.selectedItem = null;

    $scope.selectDate = 'OneMonthHistClass';
    $scope.selectClassId = '';
    $scope.selectedClassIndex = -1;

    $scope.currentClassItem = [];

    // console.log();

    $scope.currentClassItem = $rootScope.classCategoryInfos[$scope.selectDate];

    $scope.changeSelectDate = function(dtype){
      if($scope.selectDate == dtype){
        return;
      }
      $scope.selectDate = dtype;
      $scope.selectClassId = '';
      $scope.currentClassItem = [];
      $scope.currentClassItem = $rootScope.classCategoryInfos[dtype];

    };

    $scope.selectCurrentClass = function(cId, cIndex){
      $scope.selectClassId = cId;
      $scope.selectedClassIndex = cIndex;


    };


    $('#scroll_list_search').niceScroll({cursorcolor:"#d5d5d5",cursorborder:"1px solid transparent", cursorwidth:"9px", autohidemode:false});
    $scope.goHistoryList = function(){

      // console.log($scope.selectDate);
      // console.log($rootScope.classCategoryInfos[$scope.selectDate]);
      // console.log($scope.selectClassId, $scope.selectedClassIndex);
      if($scope.selectClassId && $scope.selectedClassIndex!=-1){

        $rootScope.selectedItem = $rootScope.classCategoryInfos[$scope.selectDate][$scope.selectedClassIndex];
      }

      if($rootScope.selectedItem){
        $state.go('app.historycategory');
      }

    }



  })

  .controller('HistoryDetailCtrl', function($rootScope, $scope, $state, $ionicPopup,$window, $ionicLoading, $timeout, Student, $stateParams) {

    $rootScope.currentTitle = '';
    $rootScope.showTitle = false;
    $rootScope.smallTitle = 2;

    // $scope.currentTabIndex = '准到';
    // $scope.currentTabIndex = '迟到';
    // $scope.currentTabIndex = '旷课';
    $scope.currentTabType = '迟到';

    $scope.cid = $stateParams.cid;
    $scope.ctime = $stateParams.ctime;


    $scope.studentsList = [];
    $scope.cdList = [];
    $scope.zdList = [];
    $scope.kkList = [];

    Student.getStatusByClassID($scope.cid, $scope.ctime).then(function(response){

      // console.log(' Student.getStatusByClassID');
      // console.log(response);
      $scope.studentsList = response.data;
      for(var i=0; i< $scope.studentsList.length; i++){
        if($scope.studentsList[i]['callStatus']=='迟到'){
          $scope.cdList.push($scope.studentsList[i]);
        }else if($scope.studentsList[i]['callStatus']=='准到'){
          $scope.zdList.push($scope.studentsList[i]);
        }else{
          $scope.kkList.push($scope.studentsList[i]);
        }
      }

      // console.log('scroll : ', $('#scroll_detail_list_2').length);
      setTimeout(function(){

      }, 500);



      // if(stus && stus.length>0){
      //   for(var i=0; i<stus.length; i++){
      //     if(stus[i]['callStatus']=='准到'){
      //       stus[i]['callStatus']['callStatusType'] = 2;
      //     }
      //   }
      // }



    }, function(error){

    });


    $scope.changeCurrentTab = function(stype){
      // console.log(stype);
      $scope.currentTabType = stype;
    }

    // $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
    //   console.log('ngRepeatFinished');
    //   $timeout(function(){
    //     $('#scroll_detail_list_2').niceScroll({cursorcolor:"#d5d5d5",cursorborder:"1px solid transparent", cursorwidth:"9px", autohidemode:false});
    //   }, 500);
    // });

    // $('#category_c_list').niceScroll({cursorcolor:"#d5d5d5",cursorborder:"1px solid transparent", cursorwidth:"9px", autohidemode:false});

    $scope.goCcategory=function(){
      $state.go('app.historycategory');
    }


  })
;
