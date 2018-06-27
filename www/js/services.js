angular.module('rollcall.services', [])

.factory('Login', function($http,$rootScope,SERVER_URL,REST_SERVICES,$log,$window) {
  // Might use a resource here that returns a JSON array

  var service = {};

  service.login = function (username , password) {
    var apiURL = SERVER_URL.path + REST_SERVICES.login;

    // console.log('apiURL : ', apiURL);

    var data  = {
      'uName' : username,
      'pwd': password
    };
    return $http({
      url: apiURL,
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
      },
      data: data
    }).then(function (response) {
      // console.log('response');
      // console.log(response);
      return response;
    }, function (error) {
      console.log('login data error');
      console.log(error);
      return error;
    });

    // var result = {
    //     "status": 1,
    //     "message": "successful",
    //     "data": [{"className":"\u897f\u65b9\u97f3\u4e50\u53f2\u4e0e\u6b23\u8d4f","classID":"31"},
    //       {"className":"\u897f\u65b9\u97f3\u4e50\u53f2\u4e0e\u6b23\u8d4f","classID":"30"}]
    //
    // };
    // return result;
  };

  service.changePwd = function (username , oldpwd,  password) {
    var apiURL = SERVER_URL.path + REST_SERVICES.changePwd;

    // console.log('apiURL : ', apiURL);

    var data  = {
      'uName' : username,
      'oldPwd': oldpwd,
      'newPwd': password
    };
    return $http({
      url: apiURL,
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
      },
      data: data
    }).then(function (response) {

      return response;
    }, function (error) {
      console.log('login data error');
      console.log(error);
      return error;
    });

  };

  return service;
})




  .factory('Student', function($http,$rootScope,SERVER_URL,REST_SERVICES,$log,$window) {
      // Might use a resource here that returns a JSON array

      var service = {};
      service.getStudentsList = function (classid) {
        var apiURL = SERVER_URL.path + REST_SERVICES.getStudentsList;

        // console.log('apiURL : ', apiURL);

        var data  = {
          'classID' : classid
        };
        return $http({
          url: apiURL,
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
          },
          data: data
        }).then(function (response) {

          return response;
        }, function (error) {
          console.log('get list data error');
          console.log(error);
          return error;
        });


      };
      service.checkConmitTimes = function (classid) {
        var apiURL = SERVER_URL.path + REST_SERVICES.checkConmitTimes;

        // console.log('apiURL : ', apiURL);

        var data  = {
          'classID' : classid
        };
        return $http({
          url: apiURL,
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
          },
          data: data
        }).then(function (response) {

          return response;
        }, function (error) {
          console.log('get list data error');
          console.log(error);
          return error;
        });


      };


    service.getStatusByClassID = function (classid, callTime) {
      var apiURL = SERVER_URL.path + REST_SERVICES.getStatusByClassID;

      // console.log('apiURL : ', apiURL);

      var data  = {
        'classID' : classid,
        'callTime':callTime
      };
      return $http({
        url: apiURL,
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        },
        data: data
      }).then(function (response) {

        return response;
      }, function (error) {
        console.log('get list data error');
        console.log(error);
        return error;
      });


    };

    service.setStudentsCallList = function (list) {
      var apiURL = SERVER_URL.path + REST_SERVICES.setStudentsCallList;
var tempObj = {"uploadInfo":list};
      // console.log('apiURL : ', apiURL);
//edit by wangyan 20170407
      return $http({
        url: apiURL,
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		    data: JSON.stringify(tempObj)
      }).then(function (response) {
        console.log(response);
        return response;
      }, function (error) {
        console.log('get list data error');
        console.log(error);
        return error;
      });


    };

    return service;
  });

