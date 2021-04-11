CarbonCalculator.controller('VerifiedCtrl', ['$timeout', '$q', '$scope',
  '$rootScope', '$http', '$mdSidenav', '$mdBottomSheet', '$log',
  '$mdDialog',
  '$location',
  function($timeout, $q, $scope, $rootScope, $http, $mdSidenav,
    $mdBottomSheet,
    $log, $mdDialog, $location) {

    $scope.verifiedHelp = function(ev,user_guide) {

      $mdDialog.show({
        templateUrl: '/html/verifiedModel.html',
        targetEvent: ev,
      });
    };


    $scope.close = function() {
      $mdDialog.hide();
    };
  }
  ]);