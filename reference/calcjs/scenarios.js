CarbonCalculator.factory('ScenarioService', ['$timeout', '$rootScope', '$q',
  '$http',
  'UserService',
  function ($timeout, $rootScope, $q, $http, UserService) {
    var scenarioService = {}

    // The new scenario to be added
    scenarioService.scenario = new Scenario()

    scenarioService.clearScenario = function () {
      scenarioService.scenario = new Scenario()
    }

    scenarioService.addScenario = function (scenarioDetails, push) {
      var deferred = $q.defer()
      deferred.notify('Saving scenario...')
      delete scenarioDetails.map
      delete scenarioDetails.route
      delete scenarioDetails.layers
      scenarioDetails.role = (scenarioDetails.role) ? scenarioDetails.role :
        (UserService.user.role === 'dummy') ? 'dummy' : undefined
      if (!scenarioDetails.role) scenarioDetails.username =
        (scenarioDetails.username) ? scenarioDetails.username :
        UserService.user.username
      scenarioDetails.push = (push) ? true : undefined
      var cache = []
      var scenarioData = JSON.stringify(scenarioDetails, function (key,
        value) {
        if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
            // Circular reference found, discard key
            return
          }
          // Store value in our collection
          cache.push(value)
        }
        return value
      })
      scenarioData = JSON.parse(scenarioData)
      delete scenarioData.routePath
      cache = null // Enable garbage collection
      scenarioData.legs.forEach(function (leg, i) {
        if (!leg.from) {
          scenarioData.legs[i].from = scenarioData.legs[i - 1].to
        }
      })
      $http.post('/api/save_scenario', scenarioData).success(function (
        data, status,
        headers, config) {
        if (data.success) {
          $rootScope.scenarioService.scenario = new Scenario()
          console.log('Scenario added successfully')
          scenarioService.saveMessage = 'success'
          $rootScope.scenarioService.scenario = new Scenario()
          deferred.resolve(true)
        } else if (data.scenario) {
          var calculatedScenario = new Scenario(data.scenario)
          console.log('Clearing scenario...')
          $rootScope.scenarioService.scenario = new Scenario()
          calculatedScenario.role = 'dummy'
          deferred.resolve(calculatedScenario)
        }
      }).error(function (data, status, headers, config) {
        deferred.reject('Failure to add scenario' + data.message)
      })
      return deferred.promise
    }

    scenarioService.updateScenario = function (scenarioDetails) {
      var deferred = $q.defer()
      deferred.notify('Updating scenario...')
      scenarioDetails.username = UserService.user.username
      scenarioDetails.number = $rootScope.scenarioService.editNumber
      $http.post('/api/update_scenario', scenarioDetails).success(
        function (data, status,
          headers, config) {
          if (data.success) {
            console.log('Scenario updated successfully')
            scenarioService.saveMessage = 'success'
            $rootScope.scenarioService.scenario = new Scenario()
            deferred.resolve(true)
          }
        }).error(function (data, status, headers, config) {
          deferred.reject('Failure to update scenario' + data.message)
        })
      return deferred.promise
    }

    scenarioService.deleteScenario = function (number) {
      var deferred = $q.defer()
      deferred.notify('Deleting scenario...')
      var scenarioDetails = {
        'username': UserService.user.username,
        'number': number
      }
      $http.post('/api/delete_scenario', scenarioDetails).success(
        function (data, status,
          headers, config) {
          if (data.success) {
            console.log('Scenario deleted successfully')
            scenarioService.deleteMessage = 'success'
            deferred.resolve(true)
          }
        }).error(function (data, status, headers, config) {
          deferred.reject('Failure to delete scenario' + data.message)
        })
      return deferred.promise
    }

    scenarioService.breakDownFactors = function () {
      var deferred = $q.defer()

      deferred.notify('Retrieving breakdown factors...')
      $http.post('/api/breakdown_factors').success(
        function (data, status,
          headers, config) {
          if (data.success) {
            console.log('Retrieved breakdown factors successfully')
            scenarioService.deleteMessage = 'success'
            deferred.resolve(data.breakdown_factors)
          }
        }).error(function (data, status, headers, config) {
          deferred.reject('Failure to retrieved breakdown factors' +
          data.message)
        })
      return deferred.promise
    }

    // Adding a new location to split a leg
    scenarioService.addLocation = function (index) {
      if (scenarioService.scenario.legs.length < 4) {
        var endPort = scenarioService.scenario.legs[index].to
        scenarioService.scenario.legs[index].to = undefined
        var leg = (endPort !== '') ? new Leg(undefined, endPort) : new Leg()
        leg.changeMode = true
        Object.observe(leg, function (changes) {
          var isRoute = true
          changes.forEach(function (change) {
            if (change.name === 'from' || change.name === 'to' ||
              change.name ===
              'mode' || change.name === 'map') isRoute = false
          })
          if (!isRoute) {
            $rootScope.$broadcast('legChanged', {
              index: index + 1
            })
          }
        })
        scenarioService.scenario.legs.splice(index + 1, 0, leg)
      } else {
        alert('You have reached the maximum of 4 legs')
      }
    }

    scenarioService.copyScenario = function (number) {
      var deferred = $q.defer()
      deferred.notify('Copying scenario...')
      var scenarioDetails = {
        'username': UserService.user.username,
        'number': number
      }
      $http.post('/api/copy_scenario', scenarioDetails).success(function (
        data, status,
        headers, config) {
        if (data.success) {
          console.log('Scenarios copied successfully')
          scenarioService.copyMessage = 'success'
          deferred.resolve(true)
        }
      }).error(function (data, status, headers, config) {
        deferred.reject('Failure to copy scenario' + data.message)
      })
      return deferred.promise
    }

    scenarioService.viewScenario = function () {
      var deferred = $q.defer()
      deferred.notify('Retrieving scenario...')
      var scenarioDetails = {
        'username': UserService.user.username
      }

      // If there are scenarios that are created before login or registration
      var transferScenarios = []
      if ($rootScope.scenarios.length === 0) {
        // Proceed to retrieve saved user scenarios
        retrieve()
      } else {
        var s = _.clone($rootScope.scenarios)
        var roles = s.map(function (t) {
          return t.role
        })
        if (roles.indexOf('dummy') > -1) {
          s.forEach(function (scenario, x) {
            scenario.index = x
            delete scenario.role
            // Saving scenarios to logged in user's account
            transferScenarios.push(scenarioService.addScenario(
              scenario, true))
            // Retrieve all scenarios after saving
            if (transferScenarios.length === s.length) {
              $q.all(transferScenarios).then(retrieve)
            }
          })
        } else {
          retrieve()
        }
      }

      function retrieve (results) {
        $http.post('/api/view_scenario', scenarioDetails).success(
          function (
            data, status,
            headers, config) {
            if (data.success) {
              console.log("data data",data);
              console.log("scenarioDetails",scenarioDetails);

              console.log(
                'Scenarios retrieved successfully')
              scenarioService.viewMessage = 'success'
              var scenariosArr = []
              data.scenario.forEach(function (d) {
                scenariosArr.push(new Scenario(d))
              })
              data.scenario = scenariosArr
              deferred.resolve(data)
            }
          }).error(function (data, status, headers, config) {
            deferred.reject(
            'Failure to retrieve scenario' + data.message
          )
          })
      }
      return deferred.promise
    }

    scenarioService.getHelp = function (helpDetails) {
      var deferred = $q.defer()
      deferred.notify('Requesting help...')
      helpDetails.userRole = UserService.getRole()
      $http.post('/api/save_help', helpDetails).success(function (
        data, status,
        headers, config) {
        if (data.success) {
          console.log('Help retrieved successfully')
          scenarioService.helpMessage = 'success'
          deferred.resolve(data.helpContent)
        }
      }).error(function (data, status, headers, config) {
        deferred.reject('Failure to retrieve scenario' + data.message)
      })
      return deferred.promise
    }

    // Remove a location from the scearion
    scenarioService.removeLocation = function (index) {
      if (scenarioService.scenario.legs.length > 1) {
        var endPort = scenarioService.scenario.legs[index].to
        scenarioService.scenario.legs.splice(index, 1)
        scenarioService.scenario.legs[index - 1].to = endPort
      } else {
        alert('Remaining leg cannot be removed!')
      }
    }

    // Removing a leg from the scenario
    scenarioService.removeLeg = function (index) {
      scenarioService.scenario.legs.splice(index, 1)
    }

    // Definition of Scenario object
    function Scenario (data) {
      var self = this
      self.kgs = (data) ? data.kgs : 0
      self.cbm = (data) ? data.cbm : 0
      self.ftl = (data) ? data.ftl : false
      self.fcl = (data) ? data.fcl : false
      self.co2 = (data) ? data.co2 : 0
      self.co2_efficiency = (data) ? data.co2_efficiency : 0
      self.distance = (data) ? data.distance : 0
      self.showMap = (data) ? data.showMap : false
      self.enableFcl = (data) ? data.enableFcl : false
      self.getGCD = function () {
        var lat1 = self.legs[0].from.geo[1],
          lat2 = self.legs[self.legs.length - 1].to.geo[1],
          lon1 = self.legs[0].from.geo[0],
          lon2 = self.legs[self.legs.length - 1].to.geo[0]

        /*
         * This module calculates the distance between
         * 2 geocoded locations (lat and lon). The returned
         * distance is in km
         */
        var R = 6371
        if (typeof (Number.prototype.toRad) === 'undefined') {
          Number.prototype.toRad = function () {
            return this * Math.PI / 180
          }
        }

        var dLat = parseFloat(lat2 - lat1).toRad()
        var dLon = parseFloat(lon2 - lon1).toRad()
        var lat1 = parseFloat(lat1).toRad()
        var lat2 = parseFloat(lat2).toRad()
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon /
            2) * Math
          .sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        var d = R * c

        return d
      }
      Object.observe(self, function (changes) {
        $rootScope.enableFcl = false
        changes.forEach(function (change) {
          change.object.legs.forEach(function (leg) {
            if (leg.mode === 'ocean' || leg.mode === 'road')
              $rootScope.enableFcl =
              true
          })
        })
      })
      if (!data) {
        var leg = new Leg()
        leg.changeMode = true
        Object.observe(leg, function (changes) {
          var isRoute = true
          changes.forEach(function (change) {
            if (change.name === 'from' || change.name === 'to' ||
              change.name ===
              'mode' || change.name === 'map') isRoute = false
          })
          if (!isRoute) {
            $rootScope.$broadcast('legChanged', {
              index: 0
            })
          }
        })
        leg.index = 0
        self.legs = [leg]
      } else {
        self.legs = []
        data.legs.forEach(function (leg, i) {
          leg = new Leg(leg.from, leg.to, leg)
          leg.index = i
          Object.observe(leg, function (changes) {
            var isRoute = true
            changes.forEach(function (change) {
              if (change.name === 'from' || change.name ===
                'to' ||
                change.name ===
                'mode' || change.name === 'map') isRoute =
                false
            })
            if (!isRoute) {
              $rootScope.$broadcast('legChanged', {
                index: 0
              })
            }
          })
          self.legs.push(leg)
        })
      }
    }
    scenarioService.Scenario = Scenario

    // Definition of Leg object
    function Leg (lastPort, endPort, leg) {
      var self = this
      self.from = (lastPort) ? lastPort : undefined
      self.to = (endPort) ? endPort : undefined
      self.searchFrom = ''
      self.searchTo = ''
      self.mode = undefined
      self.showMap = false
      self.showActions = false

      for (property in leg) {
        self[property] = leg[property]
      }

      self.modeIcon = function () {
        var mapIconsPath =
          '/icons/material-icons/icons/system_icons/maps/res-export/ic_'
        if (self.mode === 'ocean') return mapIconsPath +
          'directions_ferry_48px.svg'
        if (self.mode === 'air') return mapIconsPath + 'flight_48px.svg'
        if (self.mode === 'road') return mapIconsPath +
          'local_shipping_48px.svg'
        if (self.mode === 'rail') return mapIconsPath +
          'directions_train_48px.svg'
        var iconPath =
          '/icons/material-icons/icons/system_icons/alert/res-export/ic_warning_48px.svg'
        return iconPath
      }
    }

    // Draw scenario map
    function drawScenarioMap () {
      var outer = document.getElementById('shipConfig')
      angular.element(outer).ready(function () {
        var mapEl = document.getElementById('scenario_map')
        try {
          if (mapEl.offsetHeight > 0) {
            var southWest = L.latLng(-90, -180),
              northEast = L.latLng(90, 180),
              bounds = L.latLngBounds(southWest, northEast)

            var map = L.map('scenario_map', {
              minZoom: 2,
              maxZoom: 13,
              maxBounds: bounds
            }).setView([15, 0],
              2)
            scenarioService.scenario.map = map

            L.tileLayer(
                'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png', {
                  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
                  subdomains: 'abcd',
                  maxZoom: 18
                })
              .addTo(map)

            $rootScope.$broadcast('legChanged', {
              index: 0
            })
          }
        } catch (e) {

        }
      })
    };
    scenarioService.drawScenarioMap = drawScenarioMap

    // Draw the Leaflet map
    function drawMap (index) {
      var mapEl = document.getElementById('leg_map_' + (index + 1))
      angular.element(mapEl).ready(function () {
        try {
          if (mapEl.offsetHeight > 0) {
            var map = L.map('leg_map_' + (index + 1)).setView([15, 0],
              2)
            scenarioService.scenario.legs[index].map = map

            L.tileLayer(
              'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                  '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                  'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                id: 'examples.map-i875mjb7'
              }).addTo(map)

            var leg = scenarioService.scenario.legs[index]
          }
        } catch (e) {
          console.log(e.message)
        }
      })
    };
    scenarioService.drawMap = drawMap

    // Call API backend to find the shortest route between from and to locations
    function findShortestRoute (from, to, loadingPort, dischargePort,
      route_mode) {
      var route = {}
      var deferred = $q.defer()
      $rootScope.routing.notFound = false
      $http.get('/api/shortest_route', {
        params: {
          from: from.join(','),
          to: to.join(','),
          loadingPort: loadingPort,
          dischargePort: dischargePort,
          route_mode: route_mode,
          token: $rootScope.token
        }
      }).success(function (data, status, headers, config) {
        deferred.resolve(data)
      }).error(function (data, status, headers, config) {
        deferred.reject('Route not found')
      })
      return deferred.promise
    };
    scenarioService.findShortestRoute = findShortestRoute

    return scenarioService
  }
])
