CarbonCalculator.controller('activateEmailController', ['$timeout', '$q', '$scope',
  '$rootScope', '$http', '$mdSidenav', '$mdBottomSheet', '$log',
  '$mdDialog',
  '$location',
  function($timeout, $q, $scope, $rootScope, $http, $mdSidenav,
    $mdBottomSheet,
    $log, $mdDialog, $location) {

$scope.actAccParams={};
$scope.actAccParams=$location.search();
    $scope.activationResult={};


// call activateuser service here
//after successfull response only display html message , show loader util service rsponse in html
if($scope.actAccParams.token){
$scope.loader=true;
var actemailservice = $rootScope.loginService.activatemail($scope.actAccParams);
      // console.log("login credentials", $rootScope.loginService)
      actemailservice.then(function(success) {
        $scope.loader=false;
      console.log("actemailservice success",success);
       $scope.activationResult=success;
      }, function(error) {
         $scope.loader=false;
          $scope.activationResult=error;
      }, function(update) {
        console.log(update)
         $scope.loader=false;
      });
    }else{
$location.path("/#/login")
    }
  }
]);