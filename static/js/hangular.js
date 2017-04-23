var app = angular.module('hangular', ['ngCookies','ui.router','angularFileUpload']);
// comment
//States
app.config(function($stateProvider,$urlRouterProvider){

// State Providers

  $stateProvider
  .state({
    name : 'login',
    url : '/login',
    templateUrl : 'templates/login.html',
    controller : 'loginController'
  })

  .state({
    name : 'nh',
    url : '/nh',
    templateUrl : 'templates/nh.html',
    controller : 'nhController'
  })

  .state({
    name : 'venue',
    url : '/venue',
    templateUrl : 'templates/venue.html',
    controller : 'venueController'
  })

  .state({
    name : 'schedule',
    url : '/schedule',
    templateUrl : 'templates/schedule.html',
    controller : 'scheduleController'
  })

  .state({
    name : 'gallery',
    url : '/gallery',
    templateUrl : 'templates/gallery.html',
    controller : 'galleryController'
  })

  .state({
    name : 'contact',
    url : '/contact',
    templateUrl : 'templates/contact.html',
    controller : 'contactController'
  })

  .state({
    name : 'search',
    url : '/search',
    templateUrl : 'templates/search.html',
    controller : 'searchController'
  })

  .state({
    name : 'aboutus',
    url : '/proposal',
    templateUrl : 'templates/aboutus.html',
    controller : 'aboutusController'
  })

  .state({
    name : 'entourage',
    url : '/entourage',
    templateUrl : 'templates/entourage.html',
    controller : 'entourageController'
  })

  .state({
    name : 'entourage.groom_family',
    url : '/entourage/groom_family',
    templateUrl : 'templates/groom_family.html',
    controller : 'groom_familyController'
  })
  //
  .state({
    name : 'entourage/bride_family',
    url : '/entourage/bride_family',
    templateUrl : 'templates/bride_family.html',
    controller : 'bride_familyController'
  })
  //
  .state({
    name : 'entourage/grooms_men',
    url : '/entourage/grooms_men',
    templateUrl : 'templates/grooms_men.html',
    controller : 'grooms_menController'
  })
  //
  .state({
    name : 'entourage/brides_maids',
    url : '/entourage/brides_maids',
    templateUrl : 'templates/brides_maids.html',
    controller : 'brides_maidsController'
  })

  .state({
    name : 'addGuest',
    url : '/addguest',
    templateUrl : 'templates/addguest_ns.html',
    controller : 'addGuestController'
  })

  .state({
    name : 'rsvpattending',
    url : '/rsvpattending',
    templateUrl : 'templates/rsvpattending.html',
    controller : 'rsvpattendingController'
  })

  .state({
    name : 'rsvp',
    url : '/rsvp',
    params : {data : null},
    templateUrl : 'templates/rsvp.html',
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
  $rootScope.bgimg = "../assets/rsvp_bg.jpg";
  $rootScope.navcolor = "white";
  $rootScope.homeimg = "../assets/home_img_white.png";
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
  $rootScope.homeimg = "../assets/home_img_white.png";
});

app.controller('aboutusController',function($rootScope,hangularService){
  $rootScope.bgimg = "";
  $rootScope.homeimg = "../assets/home_img_black.png";
  $rootScope.navcolor = "black";
});

app.controller('scheduleController',function($rootScope,hangularService){
  $rootScope.bgimg = "";
  $rootScope.navcolor = "#ee77d7";
});

app.controller('galleryController',function($rootScope,hangularService){
  $rootScope.bgimg = "";
});

app.controller('contactController',function($rootScope,hangularService){
  $rootScope.bgimg = "";
});

app.controller('entourageController',function($rootScope,hangularService){
  $rootScope.bgimg = "";
  $rootScope.navcolor = "black";
  $rootScope.homeimg = "../assets/home_img_black.png";
});
app.controller('groom_familyController',function($rootScope,hangularService){
  $rootScope.bgimg = "";
  $rootScope.navcolor = "black";
  $rootScope.homeimg = "../assets/home_img_black.png";
});
app.controller('bride_familyController',function($rootScope,hangularService){
  $rootScope.bgimg = "";
  $rootScope.navcolor = "black";
  $rootScope.homeimg = "../assets/home_img_black.png";
});
app.controller('grooms_menController',function($rootScope,hangularService){
  $rootScope.bgimg = "";
  $rootScope.navcolor = "black";
  $rootScope.homeimg = "../assets/home_img_black.png";
});
app.controller('brides_maidsController',function($rootScope,hangularService){
  $rootScope.bgimg = "";
  $rootScope.navcolor = "black";
  $rootScope.homeimg = "../assets/home_img_black.png";
});

app.controller('rsvpattendingController',function($rootScope,hangularService){
  $rootScope.bgimg = "../assets/rsvp_bg.jpg";
  $rootScope.navcolor = "white";
  $rootScope.homeimg = "../assets/home_img_white.png";
});

app.controller('venueController',function($scope,$rootScope){
  $rootScope.bgimg = "";
  $rootScope.navcolor = "black";
  $rootScope.homeimg = "../assets/home_img_black.png";
  $scope.show_optional = false;
  $scope.show_map = false;
});

  // RSVP Controller
  app.controller('rsvpController',function($rootScope,$state,$scope,$stateParams,hangularService){
    $rootScope.bgimg = "../assets/rsvp_bg.jpg";
    $rootScope.navcolor = "white";
    $rootScope.homeimg = "../assets/home_img_white.png";
    $scope.active = 'No Response';

    $scope.setActive = function(event,response) {
        event.rsvp = response;
    };
    $scope.isActive = function(event) {
        return event.rsvp;
    };

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
  $scope.sortColumn = 'group';
  $scope.reverseSort = false;

  hangularService.getAllGuests().success(function(data){
    $scope.guests = data;
  });

  $scope.sortData = function(column){
    $scope.reverseSort = ($scope.sortColumn === column) ? !$scope.reverseSort :false;
    $scope.sortColumn = column;
  };

});
