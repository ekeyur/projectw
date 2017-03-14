var app = angular.module('hangular', ['ui.router','ngFileUpload']);

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
    name : 'addGuest',
    url : '/addguest',
    templateUrl : 'addguest.html',
    controller : 'addGuestController'
  })
  .state({
    name : 'uploadFile',
    url : '/uploadfile',
    templateUrl : 'uploadfile.html',
    controller : 'uploadfileController'
  })
  .state({
    name : 'allGuests',
    url : '/allguests',
    templateUrl : 'allguests.html',
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


//File Upload Controller





// Initial
app.controller('nhController', function($scope, $stateParams, $state, hangularService) {

  $scope.searchQuery = function(){
    $scope.showSearchResults = true;
    hangularService.searchGuests($scope.query).success(function(data){
    $scope.guests = data;
    console.log($scope.guests);
  	});
    };

  // Query to get the rsvp things
    // $scope.getParty = function(guest){
    //   hangularService.getPartyGuests(guest).success(function(data){
    //     $scope.guestsInParty = data;
    //   });
    // };

    $scope.getParty = function(guest){
      console.log(guest);
    };

  //Do Ask for RSVP
    $scope.rsvp = function(){
      // var newGuestInParty = JSON.parse(JSON.stringify($scope.guestsInParty));
      $scope.guestsInParty.forEach(function(a){
      if(a.mandvo.rsvp === true){a.mandvo.modified = true;}
      if(a.garba.rsvp === true){a.garba.modified = true;}
      if(a.wedding.rsvp === true){a.wedding.modified = true;}
      if(a.reception.rsvp === true){a.reception.modified = true;}
    });
      hangularService.rsvp($scope.guestsInParty).success(function(data){
        console.log("Updated Data");
        console.log(data);
      });
    };

  });

  app.controller('addGuestController',function($scope,hangularService){
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

app.controller('uploadfileController',function($scope,hangularService){
  $scope.UploadFile = function(){
    hangularService.uploadFile($scope.file).success(function(data){
      console.log(data);
    });
  };
});

app.controller('allGuestsController',function($scope,$state,hangularService){
  hangularService.getAllGuests($scope.fileName).success(function(data){
    $scope.guests = data;
  });
});
