CarbonCalculator.controller('AnalysisController', ['$timeout', '$q', '$scope',
  '$rootScope', '$http', '$mdSidenav', '$mdBottomSheet', '$log',
  '$mdDialog',
  '$location',
  function($timeout, $q, $scope, $rootScope, $http, $mdSidenav,
    $mdBottomSheet,
    $log, $mdDialog, $location) {

    $rootScope.scenarios = [];

    $rootScope.$watch(function() {
      return $rootScope.userService.getUsername();
    }, function(newValue, oldValue) {
      if (newValue != '') {
        $rootScope.scenarioService.viewScenario().then(function(data) {
          $rootScope.scenarios = data.scenario;
        });
        $rootScope.scenarioService.breakDownFactors().then(function(
          data) {
          $scope.breakdown_factors = data;
        });
      }
    });

    $rootScope.$watch(function() {
      return $rootScope.scenarios;
    }, function(newValue, oldValue) {
      var fullSet = ["Scenario 1", "Scenario 2", "Scenario 3",
        "Scenario 4",
        "Scenario 5", "Scenario 6", "Scenario 7", "Scenario 8",
        "Scenario 9", "Scenario 10"
      ];
      if (newValue.length != oldValue.length) {
        $scope.scenes = angular.copy(fullSet).slice(0, newValue.length);
        $scope.selected = angular.copy($scope.scenes);
        drawCharts();
      }
    });

    $scope.selectAll = function() {
      if ($scope.selected !== angular.copy($scope.scenes)) {
        $scope.selected = angular.copy($scope.scenes);
        drawCharts();
      }
    }

    $scope.clear = function() {
      $scope.selected = [];
      drawCharts();
    }

    $scope.scenes = ["Scenario 1", "Scenario 2", "Scenario 3", "Scenario 4",
      "Scenario 5", "Scenario 6", "Scenario 7", "Scenario 8",
      "Scenario 9", "Scenario 10"
    ].slice(0, $rootScope.scenarios.length);
    $scope.selected = [];

    $scope.toggle = function(item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) list.splice(idx, 1);
      else list.push(item);
      drawCharts();
    };

    $scope.exists = function(item, list) {
      return list.indexOf(item) > -1;
    };

    /*
     ** draws all the charts
     */

    function drawCharts() {
      drawOverviewGraph();
      drawCompareDistGraph();
      drawCompareCO2EfficiencyGraph();
      drawCompareCO2cbmGraph();
      drawCompareCO2kgsGraph();
    }

    /*
     ** draw charts from json
     */

    function drawOverviewGraph() {
      var width = $("#stackedchart").width() * 0.95,
        height = $("#stackedchart").width() * 0.95 / 4;
      nv.addGraph(function() {
        var width = $('#stackedchart svg').width() * 0.95,
          height = $('#stackedchart svg').width() * 0.95 / 3

        var chart = nv.models.multiBarChart()
          .reduceXTicks(true) //If 'false', every single x-axis tick label will be rendered.
          .rotateLabels(0) //Angle to rotate x-axis labels.
          .showControls(true) //Allow user to switch between 'Grouped' and 'Stacked' mode.
          .groupSpacing(0.1) //Distance between each group of bars.
          .showLegend(false);
        chart.tooltip.enabled(true);
        chart.tooltip.contentGenerator(function(key) {
          var sIndex = key.index;
          var lIndex = key.data.series;
          var leg = $rootScope.scenarios[sIndex].legs[lIndex];
          return '<p><h3 class="md-subhead"> From ' + key.data.from +
            ' to ' + key.data.to +
            '</h3></p>' +
            '<p style="text-align:left;"> <strong>CO<sub>2</sub>:</strong> ' +
            d3.format(
              ',.2f')(key.data.y) +
            ' g</p>' +
            '<p style="text-align:left;"> <strong>Mode:</strong> ' +
            key.data.mode
            .toUpperCase() + '</p>'
        });

        var formatDay = function(d) {
          return "Scenario " + d;
        }

        chart.xAxis.tickFormat(formatDay);
        // chart.xAxis.axisLabel('Emissions (g CO2) per Scenario');

        chart.yAxis
          .tickFormat(d3.format(',.1f'));

        d3.select('#stackedchart svg').attr("width", width).attr(
          "height", height);
        d3.select('#stackedchart svg')
          .datum(scenarioOverviewData())
          .call(chart);

        // var showDetails = function(d, i) {
        //   var content;
        //   content = '<p class="main">TEST</span></p>';
        //   // content += '<hr class="tooltip-hr">';
        //   // content += '<p class="main">' + d3.format(",.0f")(d.value) + " kgCO2" + '</span></p>';
        //   if (d) $rootScope.tooltip.showTooltip(content, d3.event);
        // };
        // var hideDetails = function(d, i) {
        //   $rootScope.tooltip.hideTooltip();
        // };
        //
        // d3.selectAll("rect").on("mouseover", showDetails).on("mouseout",
        //   hideDetails);

        nv.utils.windowResize(chart.update);

        return chart;
      });
    }

    function drawCompareDistGraph() {
      var width = $('#compareDistance svg').width() * 0.95,
        height = $('#compareDistance svg').width() * 0.95 / 3

      nv.addGraph(function() {
        var chart = nv.models.discreteBarChart()
          .x(function(d) {
            return d.label
          }) //Specify the data accessors.
          .y(function(d) {
            return d.value
          })
          .staggerLabels(false) //Too many bars and not enough room? Try staggering labels.
          .showValues(true) //...instead, show the bar value right on top of each bar.
          // chart.yAxis.axisLabel("Distance Travelled");
        chart.yAxis.axisLabelDistance(20);;
        chart.tooltip.enabled(true);
        // chart.yAxis.axisLabel('Distance (km)');


        d3.select('#compareDistance svg').attr("width", width).attr(
          "height", height);
        d3.select('#compareDistance svg')
          .datum(compareDistData())
          .call(chart)

        // .text("Distance");



        nv.utils.windowResize(chart.update);

        return chart;
      });
    }

    function drawCompareCO2EfficiencyGraph() {
      nv.addGraph(function() {
        var width = $('#compareCO2Efficiency svg').width() * 0.95,
          height = $('#compareCO2Efficiency svg').width() * 0.95 / 3

        var chart = nv.models.discreteBarChart()
          .x(function(d) {
            return d.label
          }) //Specify the data accessors.
          .y(function(d) {
            return d.value
          })
          .staggerLabels(false) //Too many bars and not enough room? Try staggering labels.
          .showValues(true) //...instead, show the bar value right on top of each bar.
          // chart.yAxis.axisLabel("CO2 Efficiency");
          // chart.yAxis.axisLabelDistance(20);;
        chart.tooltip.enabled(true);
        // chart.yAxis.axisLabel('Efficiency (gCO2 per RTK)');

        d3.select('#compareCO2Efficiency svg').attr("width", width).attr(
          "height", height);
        d3.select('#compareCO2Efficiency svg')
          .datum(compareCO2EfficiencyData())
          .call(chart)
          .append("text")
          .attr("text-anchor", "middle")
          // .text("CO2 Efficiency");

        nv.utils.windowResize(chart.update);

        return chart;
      });
    }

    function drawCompareCO2cbmGraph() {
      nv.addGraph(function() {
        var width = $('#compareCO2cmb svg').width() * 0.95,
          height = $('#compareCO2cmb svg').width() * 0.95 / 3

        var chart = nv.models.discreteBarChart()
          .x(function(d) {
            return d.label
          }) //Specify the data accessors.
          .y(function(d) {
            return d.value
          })
          .staggerLabels(false) //Too many bars and not enough room? Try staggering labels.
          .showValues(true) //...instead, show the bar value right on top of each bar.
          // chart.yAxis.axisLabel("CO2 per cbm");
          // chart.yAxis.axisLabelDistance(20);
        chart.tooltip.enabled(true);
        // chart.xAxis.axisLabel('g CO2 per Shipment CBM / Scenario');

        d3.select('#compareCO2cmb svg').attr("width", width).attr(
          "height", height);
        d3.select('#compareCO2cmb svg')
          .datum(compareCO2cbmData())
          .call(chart)
          .append("text")
          .attr("text-anchor", "middle")
          // .text("CO2 per cbm");

        nv.utils.windowResize(chart.update);

        return chart;
      });
    }

    // function tooltipContent(key, y, e, graph) {
    //         return '<h3>' + key + '</h3>' +'<p>' + y + '</p>' +'12312321312';
    //     }

    function drawCompareCO2kgsGraph() {
      nv.addGraph(function() {
        var width = $('#compareCO2kgs svg').width() * 0.95,
          height = $('#compareCO2kgs svg').width() * 0.95 / 3

        var chart = nv.models.discreteBarChart()
          .x(function(d) {
            return d.label
          }) //Specify the data accessors.
          .y(function(d) {
            return d.value
          })
          .staggerLabels(false) //Too many bars and not enough room? Try staggering labels.
          .showValues(true) //...instead, show the bar value right on top of each bar.
        ;
        chart.tooltip.enabled(true);
        // chart.xAxis.axisLabel('g CO2 per Shipment KG / Scenario');

        d3.select('#compareCO2kgs svg').attr("width", width).attr(
          "height", height);
        d3.select('#compareCO2kgs svg')
          .datum(compareCO2kgsData())
          .call(chart)
          .append("text")
          .attr("text-anchor", "middle")
          // .text("CO2 per tonne");

        nv.utils.windowResize(chart.update);

        return chart;
      });
    }

    /*
     ** generation of data to json form for charting
     */

    function scenarioOverviewData() {
      var chartingValues = [
        [],
        [],
        [],
        []
      ];
      for (var scenarioIndex = 0; scenarioIndex < 10; scenarioIndex++) {
        if ($scope.selected.indexOf("Scenario " + (scenarioIndex + 1)) > -1) {
          var currentScenario = $rootScope.scenarios[scenarioIndex];
          var legsArray = currentScenario.legs;
          for (var legIndex = 0; legIndex < 4; legIndex++) {
            if (legIndex < legsArray.length) {
              chartingValues[legIndex][chartingValues[legIndex].length] = {
                x: scenarioIndex + 1,
                y: legsArray[legIndex].total_co2,
                from: legsArray[legIndex].from.display,
                to: legsArray[legIndex].to.display,
                mode: legsArray[legIndex].mode
              };
            } else {
              chartingValues[legIndex][chartingValues[legIndex].length] = {
                x: scenarioIndex + 1,
                y: 0
              };
            }
          }
        }
      }
      var chartingData = [];
      chartingValues.forEach(function(data, index) {
        chartingData[chartingData.length] = {
          key: "Leg " + (index + 1),
          values: data
        };
      });
      return chartingData;
    }

    function compareDistData() {
      var data = [];
      for (var j = 0; j < $scope.selected.length; j++) {
        var scNum = $scope.selected[j].substring(9);
        var totalDist = $rootScope.scenarios[Number(scNum) - 1].distance;
        var obj = {
          "label": "Scenario " + scNum,
          "value": totalDist
        };
        data[data.length] = obj;
      }
      data.sort(function(a, b) {
        return a.label > b.label;
      });
      var chart = {
        key: "Distance Comparison",
        values: data
      };
      return [chart];
    }

    function compareCO2EfficiencyData() {
      var data = [];
      for (var j = 0; j < $scope.selected.length; j++) {
        var scNum = $scope.selected[j].substring(9);
        // var co2efficiency = $rootScope.scenarios[Number(scNum) - 1].co2_efficiency;
        var travelledToGcd = $rootScope.scenarios[Number(scNum) - 1].distance /
          $rootScope.scenarios[Number(scNum) - 1].getGCD();
        travelledToGcd = (isFinite(travelledToGcd)) ? travelledToGcd : 0;
        var obj = {
          "label": "Scenario " + scNum,
          "value": travelledToGcd
        };
        data[data.length] = obj;
      }
      data.sort(function(a, b) {
        return a.label > b.label;
      });
      var chart = {
        key: "CO2 Efficiency Comparison",
        values: data
      };
      return [chart];
    }

    function compareCO2cbmData() {
      var data = [];
      for (var j = 0; j < $scope.selected.length; j++) {
        var scNum = $scope.selected[j].substring(9);
        var co2cbm = $rootScope.scenarios[Number(scNum) - 1].co2 / 1000 /
          $rootScope.scenarios[Number(scNum) - 1].cbm;
        var obj = {
          "label": "Scenario " + scNum,
          "value": co2cbm
        };
        data[data.length] = obj;
      }
      data.sort(function(a, b) {
        return a.label > b.label;
      });
      var chart = {
        key: "CO2 per cbm Comparison",
        values: data
      };
      return [chart];
    }

    function compareCO2kgsData() {
      var data = [];
      for (var j = 0; j < $scope.selected.length; j++) {
        var scNum = $scope.selected[j].substring(9);
        var co2ton = ($rootScope.scenarios[Number(scNum) - 1].co2 /
          $rootScope.scenarios[Number(scNum) - 1].kgs) / 1000;
        var obj = {
          "label": "Scenario " + scNum,
          "value": co2ton
        };
        data[data.length] = obj;
      }
      data.sort(function(a, b) {
        return a.label > b.label;
      });
      var chart = {
        key: "CO2 per tonne Comparison",
        values: data
      };
      return [chart];
    }

    /*
     * Scenario Overview Calculations
     */

    $scope.getTotalDistance = function(boolean) {
      var total = 0;
      $scope.selected.forEach(function(string) {
        total += $rootScope.scenarios[Number(string.substring(9)) - 1]
          .distance;
      })
      total = Math.round(total);
      if (boolean === true) {
        return (total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      } else {
        return total
      }
    }

    $scope.getTotalShipmentWeight = function(boolean) {
      var total = 0;
      $scope.selected.forEach(function(string) {
        total += $rootScope.scenarios[Number(string.substring(9)) - 1]
          .kgs;
      })
      total = Math.round(total);
      if (boolean === true) {
        return (total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      } else {
        return total;
      }
    }

    $scope.getTotalCo2 = function(boolean) {
      var total = 0;
      $scope.selected.forEach(function(string) {
        total += $rootScope.scenarios[Number(string.substring(9)) - 1]
          .co2;
      })
      if (total >= 1000) {
        total = Math.round(total / 1000 * 100) / 100;
      } else if (total != 0) {
        total = String((total / 1000).toFixed(2));
      } else {
        total = 0;
      }
      if (boolean === true) {
        return (total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      } else {
        return total;
      }
    }


    $scope.getCo2PerTonne = function() {
      if ($scope.getTotalShipmentWeight() != 0) {
        return (Math.round($scope.getTotalCo2() * 100 / $scope.getTotalShipmentWeight() *
          1000) / 100);
      } else {
        return 0;
      }
    }

    $scope.getCo2PerCbm = function() {
      var total = 0;
      $scope.selected.forEach(function(string) {
        total += $rootScope.scenarios[Number(string.substring(9)) - 1]
          .cbm;
      })
      if (total != 0) {
        return (Math.round($scope.getTotalCo2() / total * 100) / 100);
      } else {
        return 0;
      }
    }

    /*
     *   Breakdown table
     */

    $scope.modeIcon = function(legmode) {
      var mapIconsPath =
        '/icons/material-icons/icons/system_icons/maps/res-export/ic_';
      if (legmode === 'ocean') return mapIconsPath +
        'directions_ferry_48px.svg';
      if (legmode === 'air') return mapIconsPath + 'flight_48px.svg';
      if (legmode === 'road') return mapIconsPath +
        'local_shipping_48px.svg';
      else return mapIconsPath +
        'directions_train_48px.svg';
    }

    $scope.showBreakdown = {
      carbon: false,
      other_gases: false
    };

    $scope.toggleBreakdown = false;

    $scope.exists_breakdown = function(number, list) {
      var item = "Scenario " + (number + 1);
      return list.indexOf(item) > -1;
    };

    $scope.calculateSummary = function(co2orOther, specificBreakdown,
      scenario) {
      var sum = 0;
      if (!$scope.breakdown_factors) {
        $rootScope.scenarioService.breakDownFactors().then(function(data) {
          $scope.breakdown_factors = data;
          var legsArray = scenario.legs;
          for (var i = 0; i < legsArray.length; i++) {
            var leg = legsArray[i];
            sum += leg.total_co2 * $scope.breakdown_factors[
              co2orOther][leg.mode][specificBreakdown];
          }
          return sum;
        });
      } else {
        var legsArray = scenario.legs;
        for (var i = 0; i < legsArray.length; i++) {
          var leg = legsArray[i];
          sum += leg.total_co2 * $scope.breakdown_factors[co2orOther][leg
            .mode
          ][specificBreakdown];
        }
        return sum;
      }
    }
  }

]);
