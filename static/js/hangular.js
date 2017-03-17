var app = angular.module('hangular', ['ngCookies','ui.router','angularFileUpload']);
// comment
//States
app.config(function($stateProvider,$urlRouterProvider){

  $stateProvider
  .state({
    name : 'login',
    url : '/login',
    templateUrl : 'login.html',
    controller : 'loginController'
  })

  .state({
    name : 'nh',
    url : '/nh',
    templateUrl : 'nh.html',
    controller : 'nhController'
  })

  .state({
    name : 'venue',
    url : '/venue',
    templateUrl : 'venue.html',
    controller : 'venueController'
  })

  .state({
    name : 'schedule',
    url : '/schedule',
    templateUrl : 'schedule.html',
    controller : 'scheduleController'
  })

  .state({
    name : 'gallery',
    url : '/gallery',
    templateUrl : 'gallery.html',
    controller : 'galleryController'
  })

  .state({
    name : 'contact',
    url : '/contact',
    templateUrl : 'contact.html',
    controller : 'contactController'
  })

  .state({
    name : 'search',
    url : '/search',
    templateUrl : 'search.html',
    controller : 'searchController'
  })

  .state({
    name : 'aboutus',
    url : '/aboutus',
    templateUrl : 'aboutus.html',
    controller : 'aboutusController'
  })

  .state({
    name : 'theparty',
    url : '/theparty',
    templateUrl : 'theparty.html',
    controller : 'thepartyController'
  })

  .state({
    name : 'addGuest',
    url : '/addguest',
    templateUrl : 'addguest_ns.html',
    controller : 'addGuestController'
  })

  .state({
    name : 'rsvpattending',
    url : '/rsvpattending',
    templateUrl : 'rsvpattending.html',
    controller : 'rsvpattendingController'
  })

  .state({
    name : 'rsvp',
    url : '/rsvp',
    params : {data : null},
    templateUrl : 'rsvp.html',
    controller : 'rsvpController'
  })

  .state({
    name : 'uploadFile',
    url : '/uploadfile',
    templateUrl : 'uploadfile_ns.html',
    controller : 'uploadfileController'
  })
  .state({
    name : 'allGuests',
    url : '/allguests',
    templateUrl : 'allguests_ns.html',
    controller : 'allGuestsController'
  });

  $urlRouterProvider.otherwise('/nh');
});

//Directives



//Factory
app.factory('hangularService',function($http,$cookies,$rootScope){
	var service = {};

  $rootScope.cookieData = null;
  $rootScope.auth = null;
  $rootScope.cookieData = $cookies.getObject('cookieData');
  // console.log("Printing initial cookie", $rootScope.cookieData);

  if ($rootScope.cookieData) {
    $rootScope.auth = $rootScope.cookieData.token;
    $rootScope.username = $rootScope.cookieData.username;
    console.log("Auth", $rootScope.auth);
    // console.log("Username", $rootScope.username);
  }

  $rootScope.logout = function(){
    $cookies.remove('cookieData');
    $rootScope.cookieData = null;
    $rootScope.auth = null;
    // $rootScope.username = null;
  };

	service.searchGuests = function(query){
		return $http({
			method : 'GET',
			url : '/searchguests',
      params : query,
		});
	};

  service.addGuest = function(data){
    // console.log(data);
    return $http({
      method : 'POST',
      url : '/addguest',
      data : {data : data, token : $rootScope.auth} 
    });
  };

  service.deleteAllGuests = function(){
    return $http({
      method : 'POST',
      url : '/deleteallguests',
      data: {token : $rootScope.auth}
    });
  };

  service.uploadFile = function(file){
    return $http({
      method : 'POST',
      url : '/upload',
      files : file,
      data: {token : $rootScope.auth}
    });
  };

  service.addGuestsFromUploadedFile = function(){
    return $http({
      method : 'POST',
      url : '/addguestsfromuploadedfile',
      data: {token : $rootScope.auth}
    });
  };

  service.getAllGuests = function(){
    return $http({
      method : 'POST',
      url : '/allguests',
      data: {token : $rootScope.auth}
    });
  };

  service.login = function(data) {
    return $http ({
      method: 'POST',
      url: '/login',
      data: data,
    });
  };

  // service.getPartyGuests = function(guest){
  //   // console.log(guest.group);
  //   return $http({
  //     method : 'POST',
  //     url : '/partyguests',
  //     data : guest,
  //   });
  // };

  service.rsvp = function(rsvp){
    return $http({
      method : 'POST',
      url : '/rsvpguest',
      data : rsvp,
    });
  };

	return service;
});



//Controllers


// Initial
app.controller('searchController', function($rootScope,$scope, $stateParams, $state, hangularService) {
  $rootScope.bgimg = "../assets/another.jpg";
  $rootScope.navcolor = "red";
  $scope.searchQuery = function(){
    if($scope.lname.length >3){
      let object = {
        fname : $scope.fname,
        lname : $scope.lname
      };
      hangularService.searchGuests(object).success(function(data){
      $scope.guests = data;
      console.log($scope.guests);
    	});
    }
  };

  $scope.getParty = function(guest){
    $state.go('rsvp',{data:guest});
  };

});

app.controller('nhController',function($rootScope,hangularService){
  $rootScope.bgimg = "../assets/background.jpg";
  $rootScope.navcolor = "white";
});

app.controller('aboutusController',function($rootScope,hangularService){
  $rootScope.bgimg = "";
});

app.controller('scheduleController',function($rootScope,hangularService){
  $rootScope.bgimg = "";
});

app.controller('galleryController',function($rootScope,hangularService){
  $rootScope.bgimg = "";
});

app.controller('contactController',function($rootScope,hangularService){
  $rootScope.bgimg = "";
});

app.controller('aboutusController',function($rootScope,hangularService){
  $rootScope.bgimg = "";
});

app.controller('thepartyController',function($rootScope,hangularService){
  $rootScope.bgimg = "";
});

app.controller('rsvpattendingController',function($rootScope,hangularService){
  $rootScope.bgimg = "";
});

  // RSVP Controller
  app.controller('rsvpController',function($rootScope,$state,$scope,$stateParams,hangularService){
    $rootScope.bgimg = "";
    $rootScope.navcolor = "green";
    $scope.guestsInParty = $stateParams.data;

    $scope.rsvp = function(){
      $scope.guestsInParty.forEach(function(g){
        if(g.mandvo.rsvp !== "No Response") {g.mandvo.modified = true;}
        if(g.garba.rsvp !== "No Response") {g.garba.modified = true;}
        if(g.wedding.rsvp !== "No Response") {g.wedding.modified = true;}
        if(g.reception.rsvp !== "No Response") {g.reception.modified = true;}
      });
      hangularService.rsvp($scope.guestsInParty).success(function(data){
        $state.go('rsvpattending');
      });
  };
  console.log($scope.guestsInParty);
});


// Login Controller
app.controller('loginController', function($scope, hangularService, $state, $cookies, $rootScope, $timeout) {
  $scope.login = function(){
    loginInfo = {
      username: $scope.user,
      password: $scope.pass
    };
    hangularService.login(loginInfo)
    .error(function(data){
      console.log("failed");
      $scope.loginfailed = true;
      $timeout(function(){$scope.loginfailed = false;}, 2500);
    })
    .success(function(data){
      console.log(data);
      $cookies.putObject('cookieData', data);
      $rootScope.username = $scope.user;
      $rootScope.auth = data.token;
      console.log('Hello', $rootScope.username);
      console.log('cookkie',$rootScope.auth);
      $state.go('allGuests');
    });
  };
});

  app.controller('addGuestController',function($rootScope,$scope,hangularService){
    $rootScope.bgimg = "";
    $scope.AddG = function(){
      var obj = {
                  "fname":$scope.fname,
                  "lname":$scope.lname,
                  "garba":$scope.garba,
                  "wedding":$scope.wedding,
                  "reception":$scope.reception,
                  "group":$scope.group,
                  "city":$scope.city
                };

    hangularService.addGuest(obj).success(function(data){
      console.log(data);
      });
    };
    // Delete eveyone from database
    $scope.deleteEveryGuest = function(){
      hangularService.deleteAllGuests().success(function(data){
        console.log(data);
      });
    };

    //Add Guests from uploaded file
    $scope.addguestsfromuploadedfile = function(){
      hangularService.addGuestsFromUploadedFile().success(function(data){
        console.log("Hello");
        console.log(data);
      });
    };
  });

app.controller('uploadfileController',function($scope,hangularService,FileUploader){
  var uploader = $scope.uploader = new FileUploader({
    url : '/upload'
  });
  uploader.onCompleteAll = function(){
    console.info('onCompleteAll');
  };

});

app.controller('allGuestsController',function($scope,$state,hangularService){
  console.log("I M IN ALL GUESTS");
  hangularService.getAllGuests().success(function(data){
    $scope.guests = data;
  });
});
