'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:slimScroll
 * @description
 * # slimScroll
 */
app
    .directive('ngNicescroll',[ "$rootScope", function ($rootScope) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs, controller) {

                var niceOption = scope.$eval(attrs.niceOption);

                var niceScroll = $(element).niceScroll(niceOption);
                niceScroll.onscrollend = function (data) {
                    if (data.end.y >= this.page.maxh) {
                        if (attrs.niceScrollEnd) scope.$evalAsync(attrs.niceScrollEnd);

                    }
                };


                scope.$on('$destroy', function () {
                    if (angular.isDefined(niceScroll)) {
                        niceScroll.remove()
                    }
                })

            }
        };
    }])

  .directive('onFinishRenderFilters', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        if (scope.$last === true) {
          $timeout(function () {
            scope.$emit('ngRepeatFinished');
          });
        }
      }
    }
  })
  .filter('studentListFilter', function () {
    return function (collection, searchname) {
      // console.info(collection);
      // console.info(searchname);
      if(!searchname || searchname==''){

        return collection;
      }
      var output = [];
      if(collection && collection.length>0){
        for(var i=0; i<collection.length; i++){
          if(collection[i]['stuName'].toLowerCase().indexOf(searchname.toLowerCase())!=-1){
            output.push(collection[i]);
          }
        }
      }
      return output;
    }
  });


