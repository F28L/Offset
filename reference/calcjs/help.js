CarbonCalculator.controller('HelpController', ['$timeout', '$q', '$scope',
  '$rootScope', '$http', '$mdSidenav', '$mdBottomSheet', '$log',
  '$mdDialog',
  '$location',
  function($timeout, $q, $scope, $rootScope, $http, $mdSidenav,
    $mdBottomSheet,
    $log, $mdDialog, $location) {

  	

    $scope.retrieveHelp = function(ev,user_guide) {
    	var helpDetails ={
    		templateHtml : user_guide
    	};
  		$rootScope.scenarioService.getHelp(helpDetails).then(function(success) {
  			$rootScope.helpGuide = 
        {
          template:user_guide,
          helpContent:success
        };
  			$mdDialog.show({
  				templateUrl: '/html/help.html',
  				targetEvent: ev,
  			});
  		}, function(reason) {
  			console.log(reason);
  		}, function(update) {
  			console.log(update)
  		});
	  };


    $scope.close = function() {
      $mdDialog.hide();
    };
  }
]);