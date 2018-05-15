angular.module('rollcall.controllers', [])

  .controller('MainCtrl', function($rootScope,$ionicLoading, $state, $scope, $stateParams) {

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
    $rootScope.getCurrentDateStr = function(){
      var _date = new Date();
      var _y = _date.getFullYear();
      var _m = getDateStr(_date.getMonth()+1);
      var _d = getDateStr(_date.getDate());
      return _y + "/" + _m + "/" +_d;
    };

    $rootScope.getClassKey = function(cid){
      return 'class_' + cid + '_' + $rootScope.getCurrentDateStr();

    };

    $rootScope.logout = function(){
      // console.log('logout');
      $state.go('login');
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
    }



  })
  .controller('LoginCtrl', function($rootScope, $scope, $state,$window, $timeout, $location,$ionicLoading, Login, ENVIRONMENT) {
    // $timeout(function(){
    //   $state.go('app.home');
    // }, 3000);
    $rootScope.classCategoryInfos = null;
    $rootScope.currentClassCategoryInfos = [];
    $rootScope.currentTitle = '';
    $rootScope.teacherName = '';
    $rootScope.showTitle = false;

    $rootScope.classInfos = null;
    $scope.loginErrorMessage = false;
    $scope.errorMessage = "";
    $rootScope.classItems = null;
    $rootScope.userName = "";

    $scope.user = {
      "username":"王卓",
      "pwd":"1234"
    };


    //change height
    // console.log("window height: ", $(window).height());
    // $('.roll_content').height($(window).height());
    if(ENVIRONMENT == 'prod'){
      console.log('prod');
      $('.roll_content').height($(window).height());
    }else{
      console.log('test');
    }

    $scope.login = function(){



      $scope.loginErrorMessage = false;
      $scope.errorMessage = '';
      if($scope.user.username==""){
        $scope.errorMessage = "请输入用户名!";
        return false;
      }

      if($scope.user.pwd==""){
        $scope.errorMessage = "请输入密码!";
        return false;
      }







      $rootScope.showLoadingToast();

      Login.login($scope.user.username, $scope.user.pwd).then(function(response){
        console.log('success');
        console.log(response);

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
          // console.log(22);
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
    $scope.goChangePwd = function(){

      $state.go('app.changepwd');
    };

    //$location.path('app/home');

  })




  .controller('HomeCtrl', function($rootScope, $scope, $ionicPopup, $timeout, $window, $state, Login, Student) {
    $rootScope.currentTitle = '';
    $rootScope.showTitle = false;

    $rootScope.smallTitle = 0;




    $scope.haveListContent = '0';
    $scope.userName =  $window.sessionStorage.getItem("userName");
    $scope.pwd =  $window.sessionStorage.getItem("password");


    // $rootScope.signSelectedType = 1;
    $scope.currentActiveItem = null;

    // console.log($window.sessionStorage.getItem($scope.userName + "_classInfos"));
    // $scope.classItems = JSON.parse($window.sessionStorage.getItem($scope.userName + "_classInfos"));
    // console.log('HomeCtrl');
    // console.log($scope.classItems);


    // $scope.haveListContent = '1';


    $scope.classItems = $rootScope.classCategoryInfos['thiSemester'];

    // console.log();
    if($scope.classItems && $scope.classItems.length>0){
      $scope.haveListContent = '1';
    }else{
      $scope.haveListContent = '2';
    }

    // console.log(teacherName);

    $scope.changeSignType = function(stype){
      $rootScope.signSelectedType = stype;
    };





    if(!$scope.classItems){
      $rootScope.showLoadingToast();

      Login.login($scope.userName, $scope.pwd).then(function(response){


        if(response && response.data && response.data.length!=0){

          var classData = response.data;

          $rootScope.classCategoryInfos = classData;



          $window.sessionStorage.setItem($scope.userName + "_classInfos", JSON.stringify(classData['thiSemester']));
          //$window.sessionStorage.setItem("classInfos", response.data);

          $scope.classItems = $rootScope.classCategoryInfos['thiSemester'];
          if( $scope.classItems.length>0){
            $scope.haveListContent = true;
          }

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
    }else{
      initOtherPart();
    }

    //console.log($rootScope.classInfos);

    initOtherPart();
    function initOtherPart(){
      var classlst = $window.localStorage.getItem($scope.userName + '_classFinished');
      // console.log('classlst');
      // console.log(classlst);
      if(classlst){
        classlst = JSON.parse(classlst);
        for(var i=0; i<$scope.classItems.length; i++){
          var ckey = $rootScope.getClassKey($scope.classItems[i]['classID']);
          // console.log(ckey);
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

      // console.log('next scope classsitem');
      // console.log($scope.classItems);
    }


    $scope.gotoNextPage = function(item){
      // console.log(item);
      // return;



      if($rootScope.signSelectedType == 1){
        if(item.exist){
          $state.go('app.result', {id:item.ckey});
        }else{
          $state.go('app.signlist', {id:item.ckey});
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
            console.log('classStuInfos');
            console.log(classStuInfos);
          }

          if(classStuInfos.hasOwnProperty(ckey2)){


            $scope.showConfirm();

          }else{
            $scope.currentActiveItem = null;
            $scope.batchSignStudents(item);
            // console.log('777777');
          }


          // $scope.batchSignStudents(item);

        }
      }

    };
    // console.log('console.log($scope.classItems);');
    // console.log($scope.classItems);
    var nh = 0;
    $scope.$watch('$viewContentLoaded',function(){

      //  var oh = $('#main-view').height();
      //  var sht = $('#home_top').height();
      // nh = oh - sht-30;
      // console.log(oh, sht);




    });



    $scope.showConfirm = function(){
      // console.log('aaa');
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
        //console.log(res);
        if (res == 'active') {
          // console.log('active');
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
          //testdata
          //for(var i=response.data.length-1; i>2; i--){
          //   response.data.splice(i,1);
          // }
          // console.log(response);

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
            "updateDate":dt,
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
          $state.go('app.result', {id:item.ckey});

        }



      }, function(error){
        $rootScope.hideLoadingToast();
      });
    };



    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
      console.log('ngRepeatFinished');
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
    console.log('SignListCtrl');

    $rootScope.smallTitle = 0;
    $scope.classKey =  $stateParams.id;
    console.log('$scope.classKey : ', $scope.classKey);
    var keyArr = $scope.classKey.split('_');
    $scope.dt = keyArr[2];
    $scope.classID = keyArr[1];
    console.log('SignListCtrl $scope.classID :', $scope.classID);
    $scope.students = null;
    $scope.currentIndex = 0;
    $scope.isStudentAnimating = false;
    $scope.isFirstItem = true;
    $scope.isLastItem = false;
    $scope.passSignNum = 0;
    $scope.currentVal = 0;
    $scope.className = '';
    $scope.userName =  $window.sessionStorage.getItem("userName");
    $scope.classItems = JSON.parse($window.sessionStorage.getItem($scope.userName + "_classInfos"));

    console.log('$scope.classItems');
    console.log($scope.classItems);
    // $scope.person ={
    //   'st':"\u6c11\u65cf\u4e50\u5668\u6f14\u594f"
    // };

    //
    // $scope.students = [{
    //   stuName:'sdfsf'
    // },{
    //   stuName:'sdfsf'
    // },{
    //   stuName:'sdfsf'
    // },{
    //   stuName:'sdfsf'
    // }];

    var classStuInfos = {};
    var classStuInfosObj = $window.localStorage.getItem($scope.userName + '_classStuInfos');




    if(classStuInfosObj){
      classStuInfos = JSON.parse(classStuInfosObj);
    }

    var ckey = $rootScope.getClassKey($scope.classID);

    console.log("ckey :", ckey);



    $scope.showConfirm2 = function(){
      console.log('aaa');
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
          console.log(ckey);
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


    console.log('SignListCtrlSignListCtrl ckey: ', ckey);

    $rootScope.currentTitle = $rootScope.teacherName;
    $rootScope.showTitle = true;
    if(classStuInfos && classStuInfos[ckey]){


      $scope.students = classStuInfos[ckey]['students'];
      $scope.currentIndex = classStuInfos[ckey]['currentIdx'];
      $scope.passSignNum =classStuInfos[ckey]['currentIdx'];
      $scope.currentVal = classStuInfos[ckey]['students'][0]['sign'];
      $scope.className = classStuInfos[ckey]['className'];
      $rootScope.currentTitle = $scope.className;





      console.log('$scope.passSignNum: ', $scope.passSignNum);
      // for(var i = 0; i<classStuInfos.length; i++){
      //   if($scope.classID == classStuInfos[i]['classID']){
      //     $scope.students = classStuInfos[i]['students'];
      //     $scope.currentIndex = classStuInfos[i]['currentIdx'];
      //
      //     console.log('localstore');
      //   }
      // }

    }

    // console.log('$scope.student');
    // console.log($scope.students);
    // console.log();
    if($scope.students){

      // console.log(111);
      $scope.passSignNum = $scope.passSignNum + 1;
      initSignList($scope.passSignNum);

    }else{
      // console.log(222);
      // console.log('$scope.classID: ', $scope.classID);
      Student.getStudentsList($scope.classID).then(function(response){

       // console.log(response);
        console.log('net work');
        console.log();

        if(response && response.data &&  response.data!="false"){
          //testdata
          //for(var i=response.data.length-1; i>2; i--){
          //   response.data.splice(i,1);
          // }
          console.log(response);

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
          // console.log('$scope.students2');
          // console.log($scope.students);
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
            "updateDate":$scope.dt,
            "students":$scope.students,
            "xxStus":xxStus,
            "currentIdx":$scope.currentIndex

          };

          classStuInfos[ckey] = obj;
          var jsonStr = JSON.stringify(classStuInfos);
          console.log(jsonStr);
          $window.localStorage.setItem($scope.userName + '_classStuInfos', jsonStr);
          initSignList();


        }



      }, function(error){

      });
    }



    $scope.nextStudent = function(){

      console.log('$scope.nextStudent');
      console.log($scope.isStudentAnimating);
      if(!$scope.isStudentAnimating){
        $scope.isStudentAnimating = true;
        var owl = $("#person_name_list").data('owlCarousel');
        //console.log("index : ", owl.currentItem);

        //console.log('nextStudent', $scope.students[owl.currentItem]);
        if($scope.students[owl.currentItem]['sign']==-1){
          setItemSign(owl.currentItem, 0);
        }


        owl.next();
        if($scope.passSignNum<owl.currentItem){
          $scope.passSignNum = owl.currentItem;
        }


        $scope.currentIndex = owl.currentItem;
        // console.log('$scope.nextStudentcurrentIndex:',$scope.currentIndex);

        $scope.currentVal = $scope.students[owl.currentItem]['sign'];
        console.log('index2: ' ,$scope.currentIndex );
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
        //console.log("index : ", owl.currentItem);
        owl.prev();

        $scope.currentIndex = owl.currentItem;
        $scope.currentVal = $scope.students[owl.currentItem]['sign'];
        console.log($scope.students[owl.currentItem]['sign']);
        console.log('index2: ' ,$scope.currentIndex );
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



          console.log('finished');
          $timeout(function(){
            $state.go('app.signstate', {id:ckey});
          }, 400);


        }
      }




    };

    function setItemSign(index, val){
      //console.log(index);
      $scope.students[index]['sign'] = val;
      console.log('setItemSign :', val);

      var temp = JSON.parse($window.localStorage.getItem($scope.userName + '_classStuInfos'));

      temp[ckey].students[index]['sign'] = val;
      //if($scope.currentIndex == index){
      console.log('$scope.passSignNum :', $scope.passSignNum);
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

        console.log($scope.isFirstItem, $scope.isLastItem);
      }, 0);


    }
    function initSignList(index){
      console.log('initSignList');
      var options = {autoPlay: false, pagination:false, autoHeight:true, touchDrag:false, mouseDrag:false, slideSpeed : 300,paginationSpeed : 300, items:1, singleItem:true};

      $timeout(function(){
        $('#person_name_list').owlCarousel(options);
        if(index && index!=0){

          console.log('index!=0 :', index);
          $scope.currentIndex = index;
          $scope.passSignNum = index;

          var owl = $("#person_name_list").data('owlCarousel');

          owl.goTo(index);
          $scope.currentIndex = index;
          changeControllerBtnVisible();
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
      console.log('DetailCtrl');
      // console.log($('#home_content').height());
      // console.log($(window).height());
    });
  })
  .controller('SignStateCtrl', function($scope, $timeout,$state ,$stateParams,$window, $rootScope) {
    console.log('SignStateCtrl');



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
    console.log($scope.classID);
    $scope.className = '';
    $scope.students = null;
    $scope.search = '';
    $scope.dataLoaded = false;
    // $scope.signYesActive = false;
    // $scope.signNoActive = true;
    // $scope.signtype = 2;

    $scope.userName =  $window.sessionStorage.getItem("userName");
    var csi = JSON.parse($window.localStorage.getItem($scope.userName + '_classStuInfos'));
   // var key = $rootScope.getClassKey($scope.classID);
    $scope.students = csi[$scope.ckey]['students'];

    console.log($scope.students);
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
    console.log($scope.cdList);
    console.log($scope.zdList);
    $scope.className = csi[$scope.ckey]['className'];

    console.log($scope.students);

    $scope.goDetailPage = function(cid, sid){
      $state.go('app.detail', {cid:cid, sid:sid});
    };


    $scope.changeCurrentStatus = function(status){
      $scope.currentTabType = status;
    }
    // $scope.filterSignYes = function(){
    //   $scope.search = '';
    //   if(!$scope.signYesActive){
    //     $scope.signYesActive = true;
    //   }else{
    //     if($scope.signNoActive){
    //       $scope.signYesActive = false;
    //     }else{
    //       return false;
    //     }
    //
    //   }
    //   if($scope.signNoActive && $scope.signYesActive){
    //     $scope.signtype = 3;
    //   }else{
    //     $scope.signtype = 2;
    //   }
    // };

    // $scope.filterSignNo = function(){
    //   $scope.search = '';
    //   if(!$scope.signNoActive){
    //     $scope.signNoActive = true;
    //   }else{
    //     if($scope.signYesActive){
    //       $scope.signNoActive = false;
    //     }else{
    //       return false;
    //     }
    //   }
    //   if($scope.signNoActive && $scope.signYesActive){
    //     $scope.signtype = 3;
    //   }else{
    //     $scope.signtype = 1;
    //   }
    // };
    // Student.getStudentsList().then(function(){
    //
    // }, function(){
    //
    // });

    // function resizeListContent(){
    //
    //
    //
    //   $timeout(function(){
    //     console.log('resizeListContent');
    //     var oh = $('#main-view').height();
    //     var sht = $('#state_top_content').height();
    //     console.log('sht : ', sht);
    //     // $timeout(function(){
    //     //   var sht2 = $('#state_top_content').height();
    //     //   console.log('sht : ', sht2);
    //     // },500);
    //
    //     var nh = oh - sht-70 -20 ;
    //     console.log(oh, sht);
    //     $('#buttom_state_warp').height(nh);
    //     $('#buttom_state_warp').niceScroll({cursorcolor:"#732729", cursorwidth:"5px"});
    //
    //   },500);
    //
    // }
    $scope.$watch('$viewContentLoaded',function(){
      // 初始化地图
      console.log('SignStateCtrl');
      // console.log($('#home_content').height());
      // console.log($(window).height());
      //resizeListContent();

    });


    // $timeout(function(){
    //   resizeListContent();
    // },1000);

    $scope.goResult = function(){
      $state.go('app.result');
    }
  })

  .controller('signSingleCtrl', function($rootScope, $scope, $timeout,$state ,$stateParams,$window) {
    console.log('signSingleCtrl');

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
    console.log(csi);
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
    console.log('-----------  ');
    console.log($scope.stu);
    console.log( $scope.currentVal);

    console.log(csi);
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
      if(fcsArr){
        fcs = JSON.parse(fcsArr);
        csi = JSON.parse($window.localStorage.getItem($scope.userName + '_classStuInfos'));
        for(var i=0; i<fcs.length; i++){
          var obj = {
            "id" : fcs[i],
            "className" : csi[fcs[i]]['className'],
            "updateDate" : csi[fcs[i]]['updateDate']
          }
          $scope.csInfos.push(obj);
        }
      }


    }
    initCsInfos();

    $scope.gotoStatePate = function(id){
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
      console.log("deleteClassItem");
      console.log(fcs);
      console.log(csi);
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
          console.log(skey);
          deleteClassItem(skey);
          initCsInfos();
        }
      });
    };




    $scope.submitLocalStorage = function(){
      var classlst = JSON.parse($window.localStorage.getItem($scope.userName + '_classFinished'));
      console.log(classlst);
      var csi = JSON.parse($window.localStorage.getItem($scope.userName + '_classStuInfos'));
      console.log(csi);
      var result = [];
      var newSts = [];
      if(classlst && classlst.length>0){
        for(var i = 0; i<classlst.length; i++){
          var ctemp = classlst[i];

          console.log('ctemp :', ctemp);
          var classInfoArr =  ctemp.split("_");
          var cId = classInfoArr[1];
          var cdt = classInfoArr[2];
          console.log(ctemp, ctemp);

          var sts = csi[ctemp]['students'];
          var xxsts = csi[ctemp]['xxStus'];

          for(var j=0; j<sts.length; j++){

            var objstu= {

              "classID":cId,
              "studentID":sts[j]["studentID"],
              "sign":sts[j].sign + '',
              "signTime":cdt
            };
            newSts.push(objstu);


          }

          for(var k=0; k<xxsts.length; k++){

            var objstu= {

              "classID":cId,
              "studentID":xxsts[j]["studentID"],
              "sign":3,
              "signTime":cdt
            };
            newSts.push(objstu);


          }


        }

        $ionicLoading.show({
          template: '<ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner><br ><span style="color:#732729;">正在上传信息，请勿断开连接...</span>',
          content: '',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });



        console.log('ssss');
        console.log(JSON.stringify(newSts));

        // return;
        Student.setStudentsCallList(newSts).then(function(response){

          $ionicLoading.hide(response);
          console.log(response);
          if(response.data && response.data ==1){
            $scope.submitResultDone = true;
            $window.localStorage.removeItem($scope.userName + '_classFinished');
            $window.localStorage.removeItem($scope.userName + '_classStuInfos');
            $window.sessionStorage.removeItem($scope.userName + "_classInfos");
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
      console.log('prod');
      $('.roll_content').height($(window).height());
    }else{
      console.log('test');
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
        console.log(response);
        $rootScope.hideLoadingToast();
        if(response.data == 1){
          $scope.successMessage = '密码修改成功, 3秒后自动返回登录页面';
          $timeout(function(){
            $scope.successMessage = '';
            $state.go('login');
          }, 3000);


        }else{
          $scope.errorMessage = "服务器忙,请稍后再试!";
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

    console.log('HistoryCategoryCtrl');
    console.log($scope.historyCurrentItem);

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

      console.log($scope.selectDate);
      console.log($rootScope.classCategoryInfos[$scope.selectDate]);
      console.log($scope.selectClassId, $scope.selectedClassIndex);
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
    $scope.currentTabType = '准到';

    $scope.cid = $stateParams.cid;
    $scope.ctime = $stateParams.ctime;


    $scope.studentsList = [];
    $scope.cdList = [];
    $scope.zdList = [];
    $scope.kkList = [];

    Student.getStatusByClassID($scope.cid, $scope.ctime).then(function(response){

      console.log(' Student.getStatusByClassID');
      console.log(response);
      $scope.studentsList = response.data;
      for(var i=0; i< $scope.studentsList.length; i++){
        if($scope.studentsList[i]['callStatus']=='迟到'){
          $scope.cdList.push($scope.studentsList[i]);
        }else if($scope.studentsList[i]['callStatus']=='准到'){
          $scope.zdList.push($scope.studentsList[i]);
        }else if($scope.studentsList[i]['callStatus']=='旷课'){
          $scope.kkList.push($scope.studentsList[i]);
        }
      }

      console.log('scroll : ', $('#scroll_detail_list_2').length);
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
      console.log(stype);
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
