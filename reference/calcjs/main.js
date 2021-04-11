CarbonCalculator.controller('MainController', ['$scope', '$timeout', '$q',
	'$rootScope',
	'$http', '$mdSidenav', '$mdBottomSheet', '$log', '$mdDialog', '$location',
	function($scope, $timeout, $q, $rootScope, $http, $mdSidenav, $mdBottomSheet,
		$log,
		$mdDialog, $location, $userService) {
		$rootScope.path = $location.path().split('/')[1];
		// alert($rootScope.userService.getUsername());
		// $rootScope.logoutMenu = [{text: username	}, {text:'Delete'}];

		$rootScope.isIE = function() {
			var userAgent = navigator.userAgent;
			if (userAgent.match(/MSIE/g) || userAgent.match(/Trident/g)) return true;
			else return false;
		};

		$rootScope.isChrome = function() {
			var userAgent = navigator.userAgent;
			if (userAgent.match(/Chrome/g) || userAgent.match(/Trident/g)) return true;
			else return false;
		};

		$scope.dummyLogin = function() {
			var login = $rootScope.loginService.dummyUser();
			$rootScope.initSettings();
		};

		$rootScope.initSettings = function() {
			if ($rootScope.isIE()) {
				$location.path('about');
			} else {
				$rootScope.loginCredentials = {
					username: '',
					password: ''
				}
				var settings = [];
				var user = $http.get('/api/current_user');
				var appSettings = $http.get('/api/settings');
				settings.push(user);
				settings.push(appSettings)
				$q.all(settings).then(function(results) {
					// App settings
					// $rootScope.densityRange = results[1].data.range;
					$rootScope.densityFactors = results[1].data;
					$rootScope.densityFactors.edit = false;

					// Set the user
					var user = results[0].data;
					if (!user.status) {
						$rootScope.token = user.webtoken;
						$rootScope.userService.setUser(user);

						if ($rootScope.userService.user.role === 'admin') {
							if ($location.path() === '/login') $location.path('admin');
						} else {
							if ($location.path() === '/login') $location.path('scenarios');
						}

						$rootScope.displaySettings = {
							showDropDown: false,
							displayDropdown: "none"
						};

						$rootScope.viewProfileOptions = function() {
							$rootScope.displaySettings.showDropDown = !$rootScope.displaySettings
								.showDropDown;
							if ($rootScope.displaySettings.showDropDown) {
								$rootScope.displaySettings.displayDropdown = "block";
							} else {
								$rootScope.displaySettings.displayDropdown = "none";
							}
						}

						$rootScope.actions = [{
							action: function() {},
							text: $rootScope.userService.getUsername(),
							icon: 'social/res-export/ic_person_48px.svg'
						}, {
							action: function() {
								$location.path('about');
								$rootScope.viewProfileOptions();
							},
							text: 'About',
							icon: 'action/res-export/ic_info_outline_48px.svg'
						}, {
							action: function() {
								$rootScope.loginService.logout();
								$rootScope.viewProfileOptions();
							},
							text: 'Logout',
							icon: 'action/res-export/ic_settings_power_48px.svg'
						}];

						// Only show About page if not logged in
						$rootScope.$watch(function() {
							return $rootScope.userService.isLoggedIn();
						}, function(newValue, oldValue) {
							if (newValue === false) {
								// $location.path('login');
								$location.path('home');

							}
						});
					} else {
						if ($location.path() !== '/reset-password' && $location.path() !=='/activateemail') {
							if ($rootScope.userService.user.role === 'dummy') $location.path(
								'scenarios');
							else if ($location.path() === '/scenarios') $scope.dummyLogin();
							else if ($rootScope.userService.user.role === '')
							{
								 // $location.path('login');
							 $location.path('home');
							}
						}
						$rootScope.token = user.webtoken;
					}
				}, function(reason) {
					// Cannot get current user
					$location.path('about');
				});
			}
		}

		// Retrieve currient navigation path
		$rootScope.$watch(function() {
			return $location.path();
		}, function(newValue, oldValue) {
			$rootScope.path = newValue.split('/')[1];
		});

		// Image extension for icons
		var isIE = /*@cc_on!@*/ false || !!document.documentMode;
		$rootScope.imgExtension = (isIE) ? '.png' : '.svg';

		$rootScope.navStyles = function(path) {
			// var styles = {
			// 	button: {
			// 		'font-weight': ($rootScope.path === path) ? 'bold' : '300',
			// 	},
			// 	divider: {
			// 		left: '10%',
			// 		width: '80%',
			// 		'border-top-width': '3px',
			// 		'border-top-color': ($rootScope.path === path) ? '#FC0' : 'transparent'
			// 	},
			// 	chevron: {
			// 		color: ($rootScope.path === path) ? 'rgb(212, 5, 17)' : 'transparent'
			// 	}
			// };
			// return styles;
			return ($rootScope.path === path);
		}

		$rootScope.hello = 'Welcome to...';

		$rootScope.shipment = {
			weight: 0,
			volume: 0,
			location: '',
			mode: undefined
		};


		$rootScope.toggleSideNav = function(name) {
			$mdSidenav(name).toggle();
		};

		$rootScope.alert = '';
		$rootScope.showAlert = function(ev) {
			$mdDialog.show(
				$mdDialog.alert()
				.title('This is an alert title')
				.content('You can specify some description text in here.')
				.ariaLabel('Password notification')
				.ok('Got it!')
				.targetEvent(ev)
			);
		};
		$rootScope.showConfirm = function(ev) {
			var confirm = $mdDialog.confirm()
				.title('Would you like to delete your debt?')
				.content('All of the banks have agreed to forgive you your debts.')
				.ariaLabel('Lucky day')
				.ok('Please do it!')
				.cancel('Sounds like a scam')
				.targetEvent(ev);
			$mdDialog.show(confirm).then(function() {
				$rootScope.alert = 'You decided to get rid of your debt.';
			}, function() {
				$rootScope.alert = 'You decided to keep your debt.';
			});
		};
		$rootScope.showAdvanced = function(ev) {
			if ($rootScope.scenarios.length < 10) {
				$mdDialog.show({
					templateUrl: '/html/add_scenario.html',
					targetEvent: ev,
					escapeToClose: false
				}).then(function(answer) {
					$rootScope.alert = 'You said the information was "' + answer + '".';
				}, function() {
					$rootScope.alert = 'You cancelled the dialog.';
				});
			} else {
				$mdDialog.show({
					templateUrl: '/html/contact.html',
					targetEvent: ev,
					escapeToClose: false
				})
			}
		};

		$rootScope.loginDialog = function(ev) {
			$rootScope.errorMessage = "";
			$mdDialog.show({
				templateUrl: '/html/login.html',
				targetEvent: ev,
			}).then(function(answer) {
				$rootScope.alert = 'You said the information was "' + answer + '".';
			}, function() {
				$rootScope.alert = 'You cancelled the dialog.';
			});
		}

		$rootScope.editShowAdvanced = function(ev) {
			$mdDialog.show({
				templateUrl: '/html/edit_scenario.html',
				targetEvent: ev,
				escapeToClose: false
			}).then(function(answer) {
				$rootScope.alert = 'You said the information was "' + answer + '".';
			}, function() {
				$rootScope.alert = 'You cancelled the dialog.';
			});
		}

		$rootScope.loadUsers = function() {
			// Use timeout to simulate a 650ms request.
			$rootScope.users = [];
			return $timeout(function() {
				$rootScope.users = [{
					id: 1,
					name: 'Scooby Doo'
				}, {
					id: 2,
					name: 'Shaggy Rodgers'
				}, {
					id: 3,
					name: 'Fred Jones'
				}, {
					id: 4,
					name: 'Daphne Blake'
				}, {
					id: 5,
					name: 'Velma Dinkley'
				}, ];
			}, 650);
		};

	}
]);
