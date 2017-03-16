var app = angular.module('hangular', ['ui.router','angularFileUpload']);
// comment
//States
app.config(function($stateProvider,$urlRouterProvider){

  $stateProvider

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
app.factory('hangularService',function($http){
	var service = {};

	service.searchGuests = function(query){
		return $http({
			method : 'GET',
			url : '/searchguests',
      params : {query: query},
		});
	};

  service.addGuest = function(data){
    // console.log(data);
    return $http({
      method : 'POST',
      url : '/addguest',
      data : data,
    });
  };

  service.deleteAllGuests = function(){
    return $http({
      method : 'POST',
      url : '/deleteallguests',
    });
  };

  service.uploadFile = function(file){
    return $http({
      method : 'POST',
      url : '/upload',
      files : file,
    });
  };

  service.addGuestsFromUploadedFile = function(){
    return $http({
      method : 'POST',
      url : '/addguestsfromuploadedfile',
    });
  };

  service.getAllGuests = function(){
    // console.log(data);
    return $http({
      method : 'GET',
      url : '/allguests',
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
  $scope.searchQuery = function(){
    if($scope.query.length >=3){
      hangularService.searchGuests($scope.query).success(function(data){
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
});
app.controller('aboutusController',function($rootScope,hangularService){
  $rootScope.bgimg = "";
});
app.controller('thepartyController',function($rootScope,hangularService){
  $rootScope.bgimg = "";
});

  // RSVP Controller
  app.controller('rsvpController',function($rootScope,$state,$scope,$stateParams,hangularService){
    $rootScope.bgimg = "";
    $scope.guestsInParty = $stateParams.data;
    $scope.guestsInParty.forEach(function(g){
      if(g.mandvo.rsvp !== "No Response") {g.mandvo.modified = true;}
      if(g.garba.rsvp !== "No Response") {g.garba.modified = true;}
      if(g.wedding.rsvp !== "No Response") {g.wedding.modified = true;}
      if(g.reception.rsvp !== "No Response") {g.reception.modified = true;}
    });
    $scope.rsvp = function(){
      hangularService.rsvp($scope.guestsInParty).success(function(data){
        console.log("Updated RSVP");
        console.log(data);
      });
    };

    console.log($scope.guestsInParty);
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
  hangularService.getAllGuests($scope.fileName).success(function(data){
    $scope.guests = data;
  });
});
