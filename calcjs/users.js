CarbonCalculator.factory('UserService', ['$http', '$rootScope', function($http,
  $rootScope) {
  var userService = {};
  userService.user = {
    loggedIn: false,
    username: '',
    role: ''
  };

  userService.getUsername = function() {
    return userService.user.username;
  };

  userService.setUser = function(options) {
    userService.user.loggedIn = true;
    for (property in userService.user) {
      if (options[property]) {
        userService.user[property] = options[property];
      }
    }
    if (options.role !== 'admin') userService.user.role = '';
  };

  userService.clearUser = function() {
    userService.user.loggedIn = false;
    userService.user.username = '';
    userService.user.role = '';
    $http.get('/api/current_user').success(function(data, status,
      headers, config) {
      $rootScope.token = data.webtoken;
    });
  };

  userService.isLoggedIn = function() {
    return userService.user.loggedIn;
  };

  userService.getRole = function() {
    return userService.user.role;
  };

  return userService;
}]);

CarbonCalculator.factory('LoginService', ['$rootScope', '$q', '$http',
  'UserService',
  function($rootScope, $q, $http, UserService) {
    var loginService = {};
    loginService.loginMessage = '';

    // loginService.login = function(credentials) {
    //   try{
    //      var deferred = $q.defer();
    //   deferred.notify('Sending credentials...');
    //   $http.post('/api/login', credentials).success(function(data, status,
    //     headers, config) {
    //     if (data.success) {
    //       console.log('Login successful...');
    //       loginService.loginMessage = 'success';
    //       UserService.user.loggedIn = true;
    //       deferred.resolve(true);
    //     }
    //   }).error(function(data, status, headers, config) {
    //     deferred.reject('Login failure... ' + data.message);
    //   });
    //   return deferred.promise;
    // } catch(e){
    //  logger1.error('Login failure... ' + data.message);
    // }
     
    // };


     loginService.login = function(credentials) {
      try{
         var deferred = $q.defer();
      deferred.notify('Sending credentials...');
      $http.post('/api/login', credentials).success(function(data, status,
        headers, config) {
        if (data.success) {
          console.log('Login successful...');
        //  if(status === 200)
        //  {
            loginService.loginMessage = 'success';
          UserService.user.loggedIn = true;
          console.log('loggedIn Successfully',data);
          deferred.resolve(data);
       //   }
        }
      }).error(function(data, status, headers, config) {
        deferred.reject(data);
      });
      return deferred.promise;
    } catch(e){
     logger1.error('Login failure... ' + data.message);
    }
     
    };
    
    
    loginService.generateReset = function(credentials) {
      var deferred = $q.defer();
      deferred.notify('Sending credentials...');
      $http.post('/api/generate_reset', credentials).success(function(
        data, status,
        headers, config) {
        console.log("status",status);
        if (status === 200) {
          console.log('Reset link sent...');
          deferred.resolve(data);
        }
      }).error(function(data, status, headers, config) {
      deferred.reject(data);
      });
      return deferred.promise;
    };

    loginService.logout = function() {
      $http.get('/api/logout').success(function() {
        UserService.clearUser();
      })
    };
loginService.activatemail = function(credentials) {
      var deferred = $q.defer();
      deferred.notify('Sending credentials...');
      $http.post('/api/activateEmail', credentials).success(function(
        data, status,
        headers, config) {
        console.log("status",status);
        if (status === 200) {
          console.log('Activated Successfully',data);
          deferred.resolve(data);
        }
      }).error(function(data, status, headers, config) {
        deferred.reject(data);
      });
      return deferred.promise;
    };

    loginService.register = function(credentials) {
      try{
        console.log(" register credentials",credentials)
          var deferred = $q.defer();
      deferred.notify('Sending credentials...');
      $http.post('/api/register', credentials).success(function(data,
        status,
        headers, config) {
        if (data.success) {
          console.log('Registration successful...');
         // loginService.loginMessage = 'success';
         // UserService.user.loggedIn = true;
          deferred.resolve(true);
        }
      }).error(function(data, status, headers, config) {
        deferred.reject(data);
      });
      return deferred.promise;
    }catch(e){

       logger1.error('Registration failure... ' + data.message);
    
    }

    
    };

    loginService.dummyUser = function() {
      UserService.user.loggedIn = true;
      UserService.user.username = '';
      UserService.user.role = 'dummy';
    };

    return loginService;
  }
]);
