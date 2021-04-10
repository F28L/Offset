CarbonCalculator.controller('LoginController', ['$scope', '$rootScope',
	'$mdDialog',
	function($scope, $rootScope, $mdDialog) {
		$scope.hide = function() {
			$mdDialog.hide();
		};
		$scope.cancel = function() {
			$mdDialog.cancel();
		};

		$rootScope.showReset = false;
		$rootScope.successMessage = '';
		 $scope.loginResult= {};
         $scope.fulName='';
		// controlling tabs
		$scope.data = {
			selectedIndex: 0,
		};
		$scope.next = function() {
			$scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2);
		};
		$scope.previous = function() {
			$scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
		};

		// login and register controls
		// $scope.login = function(credentials) {
		// 	//console.log("credentials",credentials)
		// 	var login = $rootScope.loginService.login(credentials);
		// 	//console.log("login credentials", $rootScope.loginService)
		// 	login.then(function(success) {
		// 		console.log("Login success",success);
		// 		$mdDialog.hide();
		// 		$rootScope.initSettings();
		// 	}, function(reason) {
		// 		console.log("Login fail",reason);
		// 		$rootScope.errorMessage = 'Invalid Email/Password or User is inActive!';
		// 		$rootScope.loginError = true;
		// 	}, function(update) {
		// 		console.log(update)
		// 	});
		// };

		$scope.login = function(credentials) {
			var login = $rootScope.loginService.login(credentials);
			console.log("login credentials", $rootScope.loginService)
			login.then(function(success) {
				// console.log("Login success",success);
				//$rootScope.successMessage =success;
				$mdDialog.hide();
				$rootScope.initSettings();
			}, function(error) {
				// console.log("Login error",error);
				
					$rootScope.errorMessage =error.message;
					if (error.message.includes('is blocked due to multiple wrong login attempts')) {
					          setTimeout(function(){  document.getElementById("resetpwd").click(); }, 3000);
					}
				//$rootScope.errorMessage = 'Invalid Email/Password or User is inActive!';
				$rootScope.loginError = true;
			}, function(update) {
				console.log(update)
			});
		};
		$scope.register = function(credentials) {
					 
			var register = $rootScope.loginService.register(credentials);
			console.log("register credentials", credentials);
			register.then(function(success) {
				console.log('register', success);
				$rootScope.successMessage = "Registration successful";
				// $rootScope.successMessage =
				// 	'An email has been sent to your email address. Please use the link in the email to activate your account';
			}, function(reason) {
				console.log("reason",reason)
				if (credentials.password) { $rootScope.errorMessage =  'Email Already Exists.'; }
				else { $rootScope.errorMessage =  ''; }
				console.log(reason);
			}, function(update) {
				console.log(update)
			});
		};

		$scope.sendResetLink = function(credentials) {
			var reset = $rootScope.loginService.generateReset(credentials);
			reset.then(function(sucesss) {
				$rootScope.successMessage =
					'Reset link has been sent to your e-mail';
			}, function(reason) {
			console.log('sendResetLink error reason', reason);
				$rootScope.errorMessage =
					'Invalid E-mail provided';
				console.log(reason);
			}, function(update) {
				console.log(update)
			});
		};

       $scope.goToRegiser = function(){
       	$rootScope.loginCredentials.email = $rootScope.loginCredentials.username;
		$rootScope.loginCredentials.username = $scope.fulName;
		$rootScope.errorMessage ='';
       }

       $scope.goToLogin = function(){
       	$scope.fulName = $rootScope.loginCredentials.username;
       	$rootScope.loginCredentials.username = $rootScope.loginCredentials.email;
       $rootScope.errorMessage ='';
       }

		angular.element(document).ready(function() {
			var loginEl = document.querySelector('#login');
			loginEl.addEventListener('keypress', function(e) {
				var key = e.which || e.keyCode;
				if (key === 13) { // 13 is enter
					if ($rootScope.showReset) {
						$scope.sendResetLink($rootScope.loginCredentials);
					} else {
						$scope.login($rootScope.loginCredentials);
					}
				}
			});
		})
	}
]);
