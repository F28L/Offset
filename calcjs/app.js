var CarbonCalculator = angular.module('CarbonCalculator', ['ngRoute',
	'ngMaterial', 'ngTouch', 'ngSanitize', 'ngMessages', 'angular-carousel','720kb.datepicker'
]);

// CarbonCalculator.$on('$routeChangeStart', function($event, next, current) { 
//    // ... you could trigger something here ...
//    console.log("routeChangeStart");
//  });

CarbonCalculator.run(['$rootScope', '$http', '$window', '$location',
	'UserService', 'LoginService', 'ScenarioService', 'AdminService', '$mdMedia',
	function($rootScope, $http, $window, $location, UserService, LoginService,
		ScenarioService, AdminService, $mdMedia) {
		$rootScope.currentYear = function() {
			var d = new Date();
			return d.getUTCFullYear();
		}
		$rootScope.userService = UserService;
		$rootScope.loginService = LoginService;
		$rootScope.loginCredentials = {
			username: '',
			email: '',
			company: '',
			password: ''
		};
		$rootScope.scenarioService = ScenarioService;
		$rootScope.adminService = AdminService;

		// socket.io
		var wsUri;
		switch (location.host) {
			case 'localhost':
				wsUri = 'localhost:8000'; // or PORT configured in nodemon.json
				break;
			case '127.0.0.1':
				wsUri = '127.0.0.1:8000'; // or PORT configured in nodemon.json
				break;
			case 'calculator.greentransformationlab.com':
				wsUri = 'greentransformationlab.com:8000';
				break;
			default:
				wsUri = location.host; // for Production environment
				break;
		}
		// $rootScope.socket = io.connect(wsUri + '/');
		// $rootScope.socket.on('token', function(data) {
		// 	$rootScope.token = data;
		// });

		// Tooltip
		// $rootScope.tooltip = Tooltip("vis-tooltip", 230);

		// $rootScope.$watch(function() {
		// 	return $mdMedia('gt-md');
		// }, function(big) {
		// 	$rootScope.bigScreen = big;
		// });

		$rootScope.$watch(function() {
			return window.innerWidth;
		}, function(width) {
			if (width <= 960) {
				$rootScope.smallScreen = true;
				$rootScope.largeScreen = false;
				$rootScope.desktopScreen = false;
			} else if (width <= 1200) {
				$rootScope.largeScreen = true;
				$rootScope.smallScreen = false;
				$rootScope.desktopScreen = false;
			} else if (width > 1200) {
				$rootScope.desktopScreen = true;
				$rootScope.largeScreen = false;
				$rootScope.smallScreen = false;
			}
		});
	}
]);

CarbonCalculator.config(['$routeProvider', '$locationProvider', function(
	$routeProvider,
	$locationProvider) {
	$routeProvider.when('/scenarios', {
		templateUrl: 'html/scenarios.html',
		controller: 'ScenariosController'
	}).when('/about', {
		templateUrl: 'html/about.html',
		controller: 'MainController'
	}).when('/login', {
		templateUrl: 'html/about.html',
		controller: 'MainController'
	}).when('/home', {
		templateUrl: 'html/home.html',
		controller: 'MainController'
	}).when('/analysis', {
		templateUrl: 'html/analysis.html',
		controller: 'AnalysisController'
	}).when('/legal', {
		templateUrl: 'html/legal.html'
	}).when('/admin', {
		templateUrl: 'html/admin.html'
	}).when('/reset-password', {
		templateUrl: 'html/reset-password.html',
		controller: 'PasswordController'
	}).when('/activateemail', {
		templateUrl: 'html/activateemail.html',
		controller: 'activateEmailController'
	}).otherwise({
		redirectTo: '/home'
	});
	// use the HTML5 History API
	// $locationProvider.html5Mode(true);
}]);

CarbonCalculator.config(function($mdThemingProvider) {

	$mdThemingProvider.definePalette('dhlColors', {
		'50': 'FFF5CC',
		'100': 'FFE88C',
		'400': 'FFDB4C',
		'200': 'FFDF5E',
		'300': 'FFE270',
		'500': 'FFCC00',
		'600': '997A00',
		'700': 'B28F00',
		'800': 'CCA300',
		'900': 'E6B800',
		'A100': 'D40511',
		'A200': 'D81E29',
		'A400': 'DD3741',
		'A700': 'E15058',
		'contrastDefaultColor': 'dark', // whether, by default, text (contrast)
		// on this palette should be dark or light
		'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
			'200', '300', '400', 'A700'
		],
		'contrastLightColors': ['700', '800', '900', 'A100'] // could also specify this if default was 'dark'
	});

	$mdThemingProvider.theme('default')
		.accentPalette('amber')
		.warnPalette('dhlColors', {
			'default': 'A100'
		})
		.primaryPalette('dhlColors');

	$mdThemingProvider.theme('altTheme')
		.primaryPalette('grey')
		.accentPalette('grey');

	$mdThemingProvider.theme('greenTheme')
		.primaryPalette('teal')
		.accentPalette('teal');

	$mdThemingProvider.theme('blueTheme')
		.primaryPalette('light-blue')
		.accentPalette('light-blue');

	$mdThemingProvider.theme('greyTheme')
		.primaryPalette('grey')
		.accentPalette('grey');

	$mdThemingProvider.theme('redTheme')
		.primaryPalette('red')
		.accentPalette('red');
});
