CarbonCalculator.controller('PasswordController', ['$scope', '$rootScope',
  '$http', '$location',
  '$timeout', 'UserService',
  function($scope, $rootScope, $http, $location, $timeout, UserService) {
    var q = $.deserialize(window.location.hash.split('?')[1]);
    console.log("q",q)
    $scope.username = q.username;
    $scope.token = q.token;
    $scope.valid = false;

    $scope.$watch('passwordConfirm', function(oldValue, newValue) {
   /*   if ($scope.passwordConfirm) {
        if ($scope.passwordConfirm !== $scope.password) $scope.errorMessage =
          'Password does not match!';
        if ($scope.passwordConfirm === $scope.password) $scope.errorMessage =
          '';
      }*/
    });

    $scope.resetPassword = function() {
      if ($scope.passwordConfirm != $scope.password) {
        $scope.errorMessage = 'Password does not match!';
        return false;
      }
      $http.post('/api/reset_password', {
        username: $scope.username,
        new_password: $scope.passwordConfirm,
        token: $scope.token
      }).success(function(data, status, headers, config) {
        // console.log("status",status)
        // console.log("data",data)
        if (status === 200 && data.success) {
        //  $rootScope.loginService.logout();
          $scope.successMessage =
            data.message;
            // $location.path("/#/login")
        $timeout(function() {
            $location.path('login');
          }, 3500)
        } else {
          $scope.errorMessage = data.message;
           
        }
      }).error(function(data, status, headers, config) {
        $scope.errorMessage =
          '';
      });
    }
  }
]);
