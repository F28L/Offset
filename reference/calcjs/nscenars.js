CarbonCalculator.controller('ScenariosController', ['$timeout', '$q', '$scope',
	'$rootScope', '$http', '$mdSidenav', '$mdBottomSheet', '$log', '$mdDialog',
	'$location',
	function ($timeout, $q, $scope, $rootScope, $http, $mdSidenav, $mdBottomSheet,
		$log, $mdDialog, $location) {
		// var socket = $rootScope.socket;
		// socket.on('updateScenarios', function(data) {
		// 	if (data.username === $rootScope.userService.getUsername()) {
		// 		$rootScope.scenarioService.viewScenario().then(function(data) {
		// 			$rootScope.scenarios = data.scenario;
		// 		});
		// 	}
		// });

  var COLORS = ['#FFDB4D', '#FFE066', '#FFE680', '#FFEB99', '#FFF0B2',
			'#FFF5CC', '#FFFAE6'
		]

  // $scope.slides = [{
  //   id: 0,
  //   img: '/images/welcome1.png',
  //   display: 'Welcome!',
  //   headline1: 'Try the Carbon Calculator',
  //   content1: 'Plan shipping scenarios and calculate carbon footprint with ease and interactivity. Create up to 10 multi-leg, multi-mode scenarios.',
  //   headline2: 'Registered users',
  //   content2: 'Sign up for a free Carbon Calculator account to save your scenarios and visualise the results on the Analysis page.'
  // }, {
  //   id: 1,
  //   img: '/images/scenarios.png',
  //   display: 'Core features',
  //   headline1: 'Create scenarios',
  //   content1: 'Click the Add button to create new multi-mode shipment scenarios. View calculated shipments on the main Scenarios page.',
  //   headline2: 'Analysis',
  //   content2: 'Navigate to the Analysis page from the navigation top bar to view aggregated statistics on saved scenarios (for signed in users).'
  // }, {
  //   id: 2,
  //   img: '/images/create.png',
  //   display: 'Multi-leg, multi-mode',
  //   headline1: 'Shipment parameters',
  //   content1: 'Dynamic form inputs for location search, mode change and shipment routing. Add intermediate transit destinations to your scenario.',
  //   headline2: 'Route visualization',
  //   content2: 'The interactive world map allows users to view the expected transport mode specific routing for each leg of their scenario.'
  // }, {
  //   id: 3,
  //   img: '/images/analysis.png',
  //   display: 'Analyze results',
  //   headline1: 'Results summary',
  //   content1: 'Quick view of aggregated scenario indicators, including carbon footprint. Visualize the carbon impact across all scenarios.',
  //   headline2: 'Compare scenarios',
  //   content2: 'View breakdown of other air pollutants, carbon dioxide equivalents and energy consumed for each shipment scenario.'
  // }, {
    // id: 1,
    // img: '/images/background2.png',
    // display: 'DHL Green Services',
    // headline1: 'GoGreen program',
    // content1: 'We offer a growing portfolio of green products and services. They include everything from Carbon Reports to Green Optimization or Climate Neutral Services. Visit',
    // link1: {
    //   url: 'http://www.dpdhl.com/en/responsibility/environmental-protection/green_products_and_services.html',
    //   text: 'DHL GoGreen products & services page'
    // }
    // ,
    // headline2: 'The Green Transformation Lab',
    // content2: "Combining DHL’s sustainable logistics expertise with Singapore Management University's academic rigor will help build innovative green supply chain capabilities.",
    // link2: {
    //   url: 'mailto:gogreen@dpdhl.com',
    //   text: 'Talk to us'
    // }
  // }]

  $rootScope.scenarios = []

  $scope.helap = {
    show: false
  }

  $rootScope.scenarioService.breakDownFactors().then(function (
			data) {
    $scope.breakdown_factors = data;
    console.log("Data",data);
  })

  $rootScope.$watch(function () {
    return $rootScope.userService.getUsername()
  }, function (newValue, oldValue) {
    if (newValue != '') {
      $rootScope.scenarioService.viewScenario().then(function (data) {
        $rootScope.scenarios = data.scenario
        if ($rootScope.scenarios.length === 0) {
						// $mdDialog.show({
						// 	templateUrl: '/html/add_scenario.html',
						// 	escapeToClose: true
						// });
        }
      })
    }
  })

  $rootScope.$watch(function () {
    return $rootScope.userService.getRole()
  }, function (newValue, oldValue) {
    if (newValue === 'dummy') {
      if ($rootScope.scenarios.length === 0) {
					// $mdDialog.show({
					// 	templateUrl: '/html/add_scenario.html'
					// });
      }
    }
  })

  $rootScope.smenus = [{
    smenu: function (number) {
      $rootScope.scenarioService.addNewScenario = new $rootScope.scenarioService
					.Scenario(($rootScope.scenarioService.scenario || undefined))
      $rootScope.scenarioService.scenario = new $rootScope.scenarioService.Scenario(
					$rootScope.scenarios[number])
      $rootScope.scenarioService.editNumber = number
      $rootScope.editShowAdvanced()
    },
    icon: 'editor/res-export/ic_mode_edit_48px.svg',
    text: 'Edit / View'
  }, {
    smenu: function (number) {
      if ($rootScope.scenarios.length < 10) {
        var newUpdated = []
        for (var i = 0; i < $rootScope.scenarios.length; i++) {
          newUpdated[newUpdated.length] = $rootScope.scenarios[i]
          if (i == number) {
            var obj = angular.copy($rootScope.scenarios[number])
            newUpdated[newUpdated.length] = obj
          }
        }
        $rootScope.scenarios = newUpdated
        $scope.copy(number)
      } else {
        alert(
						"You reached the maximum number of scenarios. Please delete one scenario to copy one existing or create one new scenario'"
					)
      }
    },
    icon: 'content/res-export/ic_content_copy_48px.svg',
    text: 'Duplicate'
  }, {
    smenu: function (number) {
      $rootScope.scenarios.splice(number, 1)
      $scope.delete(number)
    },
    icon: 'action/res-export/ic_delete_48px.svg',
    text: 'Delete'
  }]

  $scope.getCo2e = function (legs) {
    var co2e = {
      ttw: 0,
      wtw: 0
    }
    legs.forEach(function (leg) {
      co2e.ttw += leg.total_co2 / 1000 * $scope.breakdown_factors.co2[leg.mode].co2e_ttw
      co2e.wtw += leg.total_co2 / 1000 * $scope.breakdown_factors.co2[leg.mode].co2e_wtw
    })
    return co2e
  }

  $scope.delete = function (number) {
    var deleteScenario = $rootScope.scenarioService.deleteScenario(number)
    deleteScenario.then(function (success) {
      console.log('delete', success)
				// socket.emit('updateScenarios', {
				// 	username: $rootScope.userService.getUsername()
				// });
    }, function (reason) {
      console.log(reason)
    }, function (update) {
      console.log(update)
    })
  }

  $scope.copy = function (number) {
    var copyScenario = $rootScope.scenarioService.copyScenario(number)
    copyScenario.then(function (success) {
      console.log('copy', success)
				// socket.emit('updateScenarios', {
				// 	username: $rootScope.userService.getUsername()
				// });
    }, function (reason) {
      console.log(reason)
    }, function (update) {
      console.log(update)
    })
  }

  $scope.modeIcon = function (legmode) {
    var mapIconsPath =
				'/icons/material-icons/icons/system_icons/maps/res-export/ic_'
    if (legmode === 'ocean') return mapIconsPath +
				'directions_ferry_48px.svg'
    if (legmode === 'air') return mapIconsPath + 'flight_48px.svg'
    if (legmode === 'road') return mapIconsPath +
				'local_shipping_48px.svg'
    else return mapIconsPath +
				'directions_train_48px.svg'
  }

  $scope.openScenarioMenu = function (index) {
    document.getElementById('scenarioMenu_' + index).click()
  }
}
])
