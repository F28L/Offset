CarbonCalculator.controller('AddScenarioController', ['$scope', '$rootScope',
  '$http', '$mdDialog', '$q', '$log', '$timeout',
  function($scope, $rootScope, $http, $mdDialog, $q, $log, $timeout) {
    var socket = $rootScope.socket;

    $rootScope.routing = {
      notFound: false
    };

    $scope.hide = function() {
      $rootScope.scenarioService.scenario = ($rootScope.scenarioService.addNewScenario) ?
      $rootScope.scenarioService.addNewScenario : $rootScope.scenarioService
      .scenario;
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $rootScope.scenarioService.scenario = ($rootScope.scenarioService.addNewScenario) ?
      $rootScope.scenarioService.addNewScenario : $rootScope.scenarioService
      .scenario;
      $mdDialog.hide();
      if (!$rootScope.isChrome()) {
        var d = document.getElementsByClassName('md-dialog-container')[0];
        var b = document.getElementsByClassName('md-dialog-backdrop')[0];
        var parent = d.parentElement;
        parent.removeChild(d);
        parent = b.parentElement;
        parent.removeChild(b)
          // d.style.height = 0;
        }
      };

      document.onkeydown = function(evt) {
        evt = evt || window.event;
        if (evt.keyCode == 27) {
          $scope.cancel();
        }
      };
      $scope.helap = {
        show: false
      };

    //Save or add new scenario
    $scope.add = function(scenarioDetails) 
    {
      //console.log('hi');
      
      scenarioDetails.index = $rootScope.scenarios.length;
      if (!scenarioDetails.cbm) {
        var modes = scenarioDetails.legs.map(function(leg) {
          return leg.mode;
        });
        var df;
        if (modes.indexOf('air') > -1) {
          df = $rootScope.densityFactors.air;
        } else if (modes.indexOf('road') > -1 || modes.indexOf('rail') >
          -1) {
          df = $rootScope.densityFactors.road;
        } else {
          df = $rootScope.densityFactors.ocean
        }
        scenarioDetails.cbm = parseFloat((scenarioDetails.kgs / df).toFixed(
          2));
      }
      var saveScenario = $rootScope.scenarioService.addScenario(
        scenarioDetails);
      $rootScope.scenarioService.scenario.showRouteProgress = true;
      saveScenario.then(function(success) {
        if (success === true) {
          $rootScope.scenarioService.viewScenario().then(function(
            data) {
            $rootScope.scenarios = data.scenario;
          });
            //   socket.emit('updateScenarios', {
            //     username: $rootScope.userService.getUsername()
            //   });
          } else {
            $rootScope.scenarios.push(success);
          }
          $rootScope.scenarioService.scenario.showRouteProgress = false;
          $scope.cancel();
        }, function(reason) {
          console.log(reason);
        }, function(update) {
          console.log(update)
        });
    };

    $scope.update = function(scenarioDetails) {
      scenarioDetails.index = $rootScope.scenarioService.editNumber;
      if (!scenarioDetails.cbm) {
        var modes = scenarioDetails.legs.map(function(leg) {
          return leg.mode;
        });
        var df;
        if (modes.indexOf('air') > -1) {
          df = $rootScope.densityFactors.air;
        } else if (modes.indexOf('road') > -1 || modes.indexOf('rail') >
          -1) {
          df = $rootScope.densityFactors.road;
        } else {
          df = $rootScope.densityFactors.ocean
        }
        scenarioDetails.cbm = parseFloat((scenarioDetails.kgs / df).toFixed(
          2));
      }
      var saveScenario = $rootScope.scenarioService.addScenario(
        scenarioDetails);
      $rootScope.scenarioService.scenario.showRouteProgress = true;
      saveScenario.then(function(success) {
        if (success === true) {
          $rootScope.scenarioService.viewScenario().then(function(
            data) {
            $rootScope.scenarios = data.scenario;
          });
          // socket.emit('updateScenarios', {
          //   username: $rootScope.userService.getUsername()
          // });
        } else {
          $rootScope.scenarios.splice(scenarioDetails.index, 1,
            success);
        }
        $scope.cancel();
        $rootScope.scenarioService.scenario.showRouteProgress = false;
      }, function(reason) {
        console.log(reason);
      }, function(update) {
        console.log(update)
      });
    };

    // $scope.addPublic = function(scenarioDetails) {
    //   var obj = [scenarioDetails.legs];
    //   var saveScenario = $rootScope.scenarios.push(obj);
    // };

    var self = $rootScope;
    // list of `state` value/display objects
    self.selectedItem = null;
    self.searchText = null;
    self.querySearch = querySearch;
    self.simulateQuery = false;
    self.isDisabled = false;
    self.showMap = showMap;
    self.showScenarioMap = showScenarioMap;
    self.selectedItemChange = selectedItemChange;
    self.updateRoute = updateRoute;
    searchTextChange = searchTextChange;

    $scope.legAction = function(index, action) {
      if (action === 'insertLocation') self.scenarioService.addLocation(
        index);
        if (action === 'removeLocation') self.scenarioService.removeLocation(
          index);
          if (action === 'showRoute') self.showScenarioMap();
      }

    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
     var tempFilterText = '',
     filterTextTimeout;
     self.doSearch = false;
     self.locationSearch = '';

     function querySearch(query, airport, originAirport) 
     {
      //console.log('querySearch');
      if (filterTextTimeout) {
        self.doSearch = false;
       // console.log(self.locationSearch);
       $timeout.cancel(filterTextTimeout);
     }

     tempFilterText = query;
     filterTextTimeout = $timeout(function() {
      self.locationSearch = tempFilterText;
      self.doSearch = true;
      doSearch();
       // console.log(self.locationSearch);
      }, 1000); // delay 2000 ms

     if (originAirport) {
      originAirport = originAirport.dgf_airport_code
    }
    var results = [],
    deferred = $q.defer();

    function doSearch() 
    {
        //console.log('doSearch');
        if (query.length > 2 && self.doSearch) {
          $http.get('/api/location_search', {
            params: {
              location: query,
              airport: (airport !== undefined) ? airport : undefined,
              originAirport: (originAirport !== undefined) ?
              originAirport : undefined,
              token: $rootScope.token
            }
          }).success(function(data, status, headers, config) {
            deferred.resolve(data);
           // console.log('search success',status);
           // console.log('location $rootScope.token',$rootScope.token);
         });

        }
      }

      return deferred.promise;
    }

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item, index, type) {
      if (item === undefined) {
        $rootScope.scenarioService.scenario.legs[index].breakdown =
        undefined;
      }
      if (type === 'from' && index !== 0) {
        $rootScope.scenarioService.scenario.legs[index - 1].to = item;
      }
      var ac;
      if (type === 'from') {
        ac = $('#from_' + index).children()[0];
        $(ac.childNodes[6]).css('visibility', 'hidden');
      } else if (type === 'to') {
        ac = $('#to_' + index).children()[0];
        $(ac.childNodes[6]).css('visibility', 'hidden');
      }
    }

    function updateRoute(index) {
      var leg = self.scenarioService.scenario.legs[index];
      var map = leg.map;
      var routePath = leg.routePath;
      if (leg.map && leg.from && leg.to && leg.mode) {
        if (leg.route) {
          leg.layers.forEach(function(layer) {
            leg.map.removeLayer(layer);
          });
          leg.routeDisplayed = false;
        }

        leg.showRouteProgress = true;
        var shortestRoute = self.scenarioService.findShortestRoute(leg.from
          .geo,
          leg.to.geo, leg.from.display, leg.to.display, leg.mode.toLowerCase()
          );
        shortestRoute.then(function(data) {
          leg.showRouteProgress = false;
          leg.routePath = data;
          self.scenarioService.scenario.legs[index].route = L.geoJson(
            data);
          leg.route = L.geoJson(data);
          if (!leg.layers) {
            leg.layers = [];
          }
          leg.layers.push(leg.route);
          if (!leg.routeDisplayed) {
            leg.route.addTo(leg.map);
            leg.map.fitBounds(leg.route.getBounds());
            leg.routeDisplayed = true;
          }
        }, function(reason) {
          console.log(reason);
        }, function(update) {
          console.log(update)
        });
      }
    }

    function updateScenarioRoute() {
      var scenario = self.scenarioService.scenario;
      var map = scenario.map;
      var routePath = scenario.routePath = [];


      if (scenario.map) {
        // Remove existing layers
        if (scenario.route) {
          scenario.layers.forEach(function(layer) {
            scenario.map.removeLayer(layer);
          });
          scenario.routeDisplayed = false;
        }

        var displayLegs = [];
        scenario.legs.forEach(function(leg, index) {
          if (leg.from && leg.to && leg.mode) {
            scenario.legs[index].displayIndex = displayLegs.length;
            displayLegs.push(leg);
          }
        });

        var shortestRouteQ = [];

        if (displayLegs.length > 0) scenario.showRouteProgress = true;
        displayLegs.forEach(function(leg) {
          var shortestRoute = self.scenarioService.findShortestRoute(
            leg.from.geo, leg.to.geo, leg.from.display, leg.to.display,
            leg.mode.toLowerCase()
            );
          shortestRouteQ.push(shortestRoute);
        });
        $q.all(shortestRouteQ).then(function(data) {
          $rootScope.routing.notFound = false;
          routePath = data;
          routePath.forEach(function(route, index) {
              // Leg distance breakdown
              scenario.legs.forEach(function(leg, x) {
                if (leg.displayIndex === index) {
                  if (route.breakdown.main.mode === 'ocean') {
                    // CCWG OFR distance Adjustment of 15%
                    var distAdjust = 1; // changing back to 100%
                    route.breakdown.main.distance *= distAdjust;
                  }
                  scenario.legs[x].breakdown = route.breakdown;
                }
              });

              var color;
              if (index === 0) color = 'rgb(255,204,0)';
              if (index === 1) color = '#323232';
              if (index === 2) color = 'rgb(212,5,17)';
              if (index === 3) color = 'rgb(84,93,98)';
              route.features.forEach(function(feature) {
                var roadSubleg = (feature.properties.subleg) ?
                true : false;
                var properties = {};
                for (p in feature.properties) properties[p] =
                  feature.properties[p];
                feature.properties = {
                  style: {
                    'color': color,
                    'weight': 5,
                    'opacity': (roadSubleg) ? 0.5 : 0.8,
                    'dashArray': (roadSubleg) ?
                    '10, 10' : 'none'
                  },
                  popupContent: '<strong class="md-subhead">#' +
                  (index + 1) +
                  '. ' +
                  displayLegs[index].from.display +
                  ' to ' + displayLegs[index].to.display +
                  '</strong><br/>Mode: ' +
                  displayLegs[
                  index].mode.toUpperCase() +
                  '<br>Total Distance: ' +
                  Math.round(data[index].breakdown.main.distance +
                    ((data[index].breakdown.pickup) ? data[
                      index].breakdown.pickup.distance :
                      0) +
                    ((data[index].breakdown.delivery) ?
                      data[
                      index].breakdown.delivery.distance :
                      0) +
                    ((data[index].breakdown.main.mode == 'ocean') ?
                      ((data[
                      index].breakdown.main.distance * 15)/100) :
                      0)) +
                  " km",
                  from: displayLegs[index].from,
                  to: displayLegs[index].to,
                  legIndex: index
                };

                // console.log("data[index].breakdown.main",data[index].breakdown.main);
                if (roadSubleg) {
                  feature.properties.popupContent +=
                  '<br/>Road transit: ' + (properties.subleg ===
                    'pickup' ? properties.origin +
                    ' to ' + properties.pol : properties.pod +
                    ' to ' + properties.destination);
                  feature.properties.popupContent += ', ' + (
                    properties.subleg === 'pickup' ? Math.round(
                      data[index].breakdown.pickup.distance) :
                    Math.round(data[index].breakdown.delivery
                      .distance)
                    ) + ' km';
                } else {

                  if(data[index].breakdown.main.mode == "ocean"){
                   feature.properties.popupContent +=
                   '<br/>Main haul (adjusted distance): ' + Math.round(data[index]
                    .breakdown
                    .main.distance + (data[index]
                    .breakdown
                    .main.distance*15/100)) + ' km';
                    feature.properties.popupContent +=
                 '<br/>Main haul (shortest distance): ' + Math.round(data[index]
                  .breakdown
                  .main.distance) + ' km';

                 }else{
                   feature.properties.popupContent +=
                 '<br/>Main haul : ' + Math.round(data[index]
                  .breakdown
                  .main.distance) + ' km';


                 }
               }


                

             });
            });

          function onEachFeature(feature, layer) {
              // does this feature have a property named popupContent?
              if (feature.properties && feature.properties.popupContent) {
                var linelatlngs = [];
                if (layer._layers) {
                  var latlngs = Object.keys(layer._layers).map(function(
                    k) {
                    return layer._layers[k]
                  });
                  latlngs.forEach(function(latlngs, index) {
                    linelatlngs.push(latlngs._latlngs);
                  });
                } else {
                  linelatlngs = layer._latlngs;
                }
                layer.bindPopup(feature.properties.popupContent);
                var transparentLine = new L.MultiPolyline(linelatlngs, {
                  color: 'transparent',
                  weight: 30,
                  opacity: 0.5,
                  smoothFactor: 1
                });
              }
            }

            scenario.showRouteProgress = false;
            scenario.routePath = routePath;
            scenario.route = L.geoJson(routePath, {
              style: function(feature) {
                return feature.properties.style;
              },
              onEachFeature: onEachFeature
            });
            if (!scenario.layers) scenario.layers = [];
            scenario.layers.push(scenario.route);
            if (!scenario.routeDisplayed) {
              scenario.route.addTo(scenario.map);
              scenario.map.fitBounds(scenario.route.getBounds());
              scenario.routeDisplayed = true;
            }
          },
          function(reason) {
            $rootScope.routing.notFound = true;
            console.log(reason);
          },
          function(update) {
            console.log(update);
          });
}

}

    /**
     * Create filter function for a query string
     */
     function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }

    function showMap(index) {
      self.scenarioService.scenario.legs[index].showMap = !self.scenarioService
      .scenario.legs[index].showMap;
      self.scenarioService.drawMap(index);
    }

    function showScenarioMap() {
      self.scenarioService.scenario.showMap = !self.scenarioService.scenario
      .showMap;
      self.scenarioService.drawScenarioMap();
    }

    // Do not display any maps when first opened
    self.scenarioService.scenario.legs.forEach(function(leg, i) {
      leg.showMap = false;
    });
    self.scenarioService.scenario.showMap = false;

    if (!self.thisAddScenarioController) {
      var t = new Date();
      $scope.t = t.toString();
      self.thisAddScenarioController = [t.toString()];
    } else {
      var t = new Date();
      self.thisAddScenarioController.push(t.toString());
    }

    self.$on('legChanged', function(e, d) {
      //updateRoute(d.index);
      if ($scope.t === self.thisAddScenarioController[0]) {
        updateScenarioRoute();
      }
    });

    self.disableSave = function() {
      var disabled = false;

      // Check modes
      $rootScope.scenarioService.scenario.legs.forEach(function(leg) {
        if (!leg.mode) disabled = true;
        if (!leg.breakdown) disabled = true;
      });

      if ($rootScope.scenarioService.scenario.showRouteProgress) disabled =
        true;
      if (!$rootScope.scenarioService.scenario.kgs) disabled = true;
      // if (!$rootScope.scenarioService.scenario.cbm) disabled = true;

      return disabled;
    };

    self.disableMode = function() {
      var disabled = false;

      if ($rootScope.scenarioService.scenario.showRouteProgress) disabled =
        true;

      if ($rootScope.routing.notFound) disabled = false;

      return disabled;
    };

    self.selectOFRType = function(leg, index) {
      if (leg.mode === 'ocean') {
        var dropdown = document.getElementById('selectOFRType_' + index);
        dropdown.click();
      }
    };

    self.selectTruckType = function(leg, index) {
      if (leg.mode === 'road') {
        var dropdown = document.getElementById('selectTruckType_' + index);
        dropdown.click();
      }
    };

    $rootScope.adminService.getRoadEmissionFactors().then(function(factors) {
      $scope.truckTypes = factors;
      if ($rootScope.userService.user.role === 'admin') {
        $scope.truckTypes.forEach(function(truck, i) {
          $scope.truckTypes[i] = truck.type;
        });
      }
      $scope.ofrTypes = ['Dry', 'Reefer'];
    });

    self.selectRailType = function(leg, index) {
      if (leg.mode === 'rail') {
        var dropdown = document.getElementById('selectRailType_' + index);
        dropdown.click();
      }
    };

    $rootScope.adminService.getRailEmissionFactors().then(function(factors) {
      $scope.railTypes = factors;
      if ($rootScope.userService.user.role === 'admin') {
        $scope.railTypes.forEach(function(train, i) {
          $scope.railTypes[i] = train.vessel;
        });
      }
    });

    self.scenarioService.drawScenarioMap();
  }
  ]);
