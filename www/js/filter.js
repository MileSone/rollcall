app.filter('myfilter', function() {
  return function(input, signtype) {
    //console.log(input);
    var t =signtype;
    //console.log(t);
    signtype = signtype ? signtype : 3;
    if(signtype==3){
      return input;
    }else{
      var output = [];
      var sh = signtype;
      //console.log('sh :', sh);

      angular.forEach(input, function(v,k){
        //console.log(v.sign);
        if (v.sign == sh) {
          output.push(v);
        }
      });

      return output;
    }

  };
});
