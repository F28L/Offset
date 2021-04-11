CarbonCalculator.factory('AdminService', ['$rootScope', '$q', '$http',
  'UserService',
  function($rootScope, $q, $http, UserService) {
    var adminService = {};
    var ExistingTrackData = {};
    var oldroadnef ={};
    var oldrailnef ={};
    var olddencityef ={};
    var oldairef ={};
    var oldoceanef = {};
    var airport;
    var displayorigin;
    var displaydestination;


    adminService.airport = true;


    //sowjnya 14/03/2019

    adminService.existingAirEmissionFactors = function(ef,airport,display) {

      oldairef = angular.copy(ef);
      displayorigin = display.origin.display;
      displaydestination = display.destination.display;
      airport = angular.copy(airport)
    };


    adminService.existingOceanEmissionFactors = function(ef) {

      oldoceanef = angular.copy(ef);
    };

    adminService.existingRoadEmissionFactors = function(ef) {

      oldroadnef = angular.copy(ef);
      
    };

    adminService.existingRailEmissionFactors = function(ef) {

      oldrailnef = angular.copy(ef);
    };
    adminService.existingDencityFactors = function(ef) {

      olddencityef = angular.copy(ef);
      // console.log("olddencityef",olddencityef)
    };
    // Air Emission Factors
    adminService.getAirEmissionFactors = function() {
      var deferred = $q.defer();
      $http.get('/api/emission_factors?mode=air', {
        params: {
          originAirportCode: $rootScope.airport.origin.dgf_airport_code,
          destinationAirportCode: $rootScope.airport.destination.dgf_airport_code,
          origin_iso: $rootScope.airport.origin.country,
          destination_iso: $rootScope.airport.destination.country
        }
      }).success(function(data,
        status, headers, config) {
        deferred.resolve(data);
      }).error(function(data, status, headers, config) {
        deferred.reject('Unable to retrieve air emission factors');
      });

      return deferred.promise;
    };
    //sowjnya 19/03/2019

    adminService.saveAirEmissionFactors = function(ef) {
      var id = '' + ef._id;
      delete ef._id;
      var deferred = $q.defer();
      var mode = 'Air';
      var emmissionfactors =ef;
      // console.log("ef",ef)
      var newefactorss = oldairef;

      var auditDetails = {
        "User": UserService.user.username,
        "Mode": mode,
        "Content":[],
        "ContentType": mode + " Emission Factors",
        "Date": new Date()
      }
      // console.log("auditDetails",auditDetails)


      if(airport == false){
        if(newefactorss.emission_factors.co2_rtk != emmissionfactors.emission_factors.co2_rtk){
          auditDetails.Content.push(ef.origin_airport + " to " + ef.destination_airport + " co2_rtk value changed from  "+newefactorss.emission_factors.co2_rtk +"  to " + emmissionfactors.emission_factors.co2_rtk)
        }
        if(newefactorss.emission_factors.co2e_rtk != emmissionfactors.emission_factors.co2e_rtk){
          auditDetails.Content.push(ef.origin_airport + " to " + ef.destination_airport + " co2e_rtk value changed from  "+newefactorss.emission_factors.co2e_rtk +"  to " + emmissionfactors.emission_factors.co2e_rtk)
        }
      }else{
        if(newefactorss.emission_factors.co2_rtk != emmissionfactors.emission_factors.co2_rtk){
          auditDetails.Content.push(displayorigin + " to " + displaydestination + " co2_rtk value changed from  "+newefactorss.emission_factors.co2_rtk +"  to " + emmissionfactors.emission_factors.co2_rtk)
        }
        if(newefactorss.emission_factors.co2e_rtk != emmissionfactors.emission_factors.co2e_rtk){
          auditDetails.Content.push(displayorigin + " to " + displaydestination + " co2e_rtk value changed from  "+newefactorss.emission_factors.co2e_rtk +"  to " + emmissionfactors.emission_factors.co2e_rtk)
        }
      }

      // console.log("auditDetails",auditDetails)

      $http.post('/api/save_emission_factors', {
        mode: 'air',
        ef: ef,
        _id: id
      }).success(
      function(data,
        status, headers, config) {
        if(auditDetails.Content.length != 0){
          $http.post('/api/saveauditlog',auditDetails).success(
            function(data,
              status, headers, config) {
              deferred.resolve(true);
            }).error(function(data, status, headers, config) {
              deferred.reject('Unable to save Ocean old emission factors');
            });
          }
          deferred.resolve(true);
        }).error(function(data, status, headers, config) {
          deferred.reject('Unable to retrieve air emission factors');
        });

        return deferred.promise;
      };

    // Road Emission Factors
    adminService.getOceanEmissionFactors = function() {
      var deferred = $q.defer();
      $http.get('/api/emission_factors?mode=ocean').success(function(data,
        status, headers, config) {
        data.forEach(function(ef, i) {
          data[i].edit = false;
          data[i].regions = [];
          data[i].regions.push(data[i]['Source']);
          if(data[i]['Intra'] == true){
            data[i].regions.push(data[i]['Source']);
          }else{
            data[i].regions.push(data[i]['Destination']);

          }
        });
        deferred.resolve(data);
      }).error(function(data, status, headers, config) {
        deferred.reject('Unable to retrieve ocean emission factors');
      });

      return deferred.promise;
    };



    adminService.getAuditlogData = function(Audit) {
      var deferred = $q.defer();
      $http.post('/api/geAuditlog', Audit).success(function(data,
        status, headers, config) {
        if (data.success) {
          console.log('Audit Data retrieved successfully');
          deferred.resolve(data);
          // console.log("data",data)
        }
      }).error(function(data, status, headers, config) {
        deferred.reject('Unable to retrieve Audit data');
      });

      return deferred.promise;
    };
    //sowjnya 14/03/2019
    adminService.saveOceanEmissionFactors = function(ef) {
      var efData = {};
      // console.log("oldoceanef",oldoceanef)

      efData["Source"] = ef["Source"];

      if(ef["Intra"] == true){
        efData["Intra"] = true
      } else{
        efData["Destination"] = ef["Destination"];
      }

      efData.emission_factors = ef.emission_factors;
      var deferred = $q.defer();
      var mode = 'Ocean';
      var emmissionfactors =ef.emission_factors;
      var newefactorss = oldoceanef.emission_factors;
      
      
      var auditDetails = {
        "User": UserService.user.username,
        "Mode": mode,
        "Content":[],
        "ContentType": "Ocean Emission Factors",
        "Date": new Date()
      }
      if(newefactorss.dry != emmissionfactors.dry){
        auditDetails.Content.push(ef.Source + " to " + ef.Destination + " pair Dry value changed from  "+newefactorss.dry +"  to " + emmissionfactors.dry)
      }
      if(newefactorss.reefer != emmissionfactors.reefer){
        auditDetails.Content.push(ef.Source + " to " + ef.Destination + " pair Reefer value changed from  "+newefactorss.reefer +"  to " + emmissionfactors.reefer)
      }
      if(newefactorss.utilization != emmissionfactors.utilization){
        auditDetails.Content.push(ef.Source + " to " + ef.Destination + " pair Utilization value changed from  "+newefactorss.utilization +"  to " + emmissionfactors.utilization)
      }
      if(newefactorss.year != emmissionfactors.year){
        auditDetails.Content.push(ef.Source + " to " + ef.Destination + " pair Year value changed from  "+newefactorss.year +"  to " + emmissionfactors.year)
      }
      // console.log("auditDetails",auditDetails)

      $http.post('/api/save_emission_factors', {
        mode: 'ocean',
        ef: efData,
        _id: ef._id
      }).success(
      function(data,
        status, headers, config) {
        if(auditDetails.Content.length != 0){
          $http.post('/api/saveauditlog',auditDetails).success(
            function(data,
              status, headers, config) {
              deferred.resolve(true);
            }).error(function(data, status, headers, config) {
              deferred.reject('Unable to save ocean old emission factors');
            });
          }

          deferred.resolve(true);
        }).error(function(data, status, headers, config) {
          deferred.reject('Unable to retrieve ocean emission factors');
        });
        return deferred.promise;
      };

      
      

    // Road Emission Factors
    adminService.getRoadEmissionFactors = function() {
      var deferred = $q.defer();
      $http.get('/api/emission_factors?mode=road').success(function(data,
        status, headers, config) {
        data.forEach(function(ef, i) {
          data[i].edit = false;
          for (p in ef) {
            if (ef[p] === true) {
              data[i].region = p;
              delete ef[p];
            }
          }
        });
        deferred.resolve(data);
      }).error(function(data, status, headers, config) {
        deferred.reject('Unable to retrieve road emission factors');
      });

      return deferred.promise;
    };

    // Road Emission Factors
    adminService.getRailEmissionFactors = function() {
      var deferred = $q.defer();
      $http.get('/api/emission_factors?mode=rail').success(function(data,
        status, headers, config) {
        deferred.resolve(data);
      }).error(function(data, status, headers, config) {
        deferred.reject('Unable to retrieve rail emission factors');
      });

      return deferred.promise;
    };

    adminService.saveRoadEmissionFactors = function(ef) {
      var efData = {};
      efData.type = ef.type;
      efData.loading = ef.loading;
      efData.capacity = ef.capacity;
      efData.gCO2 = ef.gCO2;
      efData.default = ef.default;
      efData[ef.region] = true;

      var deferred = $q.defer();
      //sowjanya 19/03/2019 - CR audit log
      var mode = 'Road';
      var emmissionfactors =ef;
      var oldefactors = oldroadnef;
      
      var auditDetails = {
        "User": UserService.user.username,
        "Mode": mode,
        "Content":[],
        "ContentType": mode + " Emission Factors",
        "Date": new Date()
      }

      if(oldefactors.region != emmissionfactors.region){
        auditDetails.Content.push("Region value for the type " + ef.type + " has been changed from " + oldefactors.region + " to " + emmissionfactors.region)
      }

      if(oldefactors.capacity != emmissionfactors.capacity){
        auditDetails.Content.push("Capacity value for the type " + ef.type + " has been changed from " + oldefactors.capacity + " to " + emmissionfactors.capacity)
      }
      if(oldefactors.loading != emmissionfactors.loading){
        auditDetails.Content.push("Load Factor value for the type " + ef.type + " has been changed from " + oldefactors.loading + " to " + emmissionfactors.loading)
      }
      if(oldefactors.gCO2.km != emmissionfactors.gCO2.km){
        auditDetails.Content.push("gCO2 km value for the type " + ef.type + " has been changed from " + oldefactors.gCO2.km + " to " + emmissionfactors.gCO2.km)
      }
      if(oldefactors.gCO2.tkm != emmissionfactors.gCO2.tkm){
        auditDetails.Content.push("gCO2 tKM value for the type " + ef.type + " has been changed from " + oldefactors.gCO2.tkm + " to " + emmissionfactors.gCO2.tkm)
      }
      $http.post('/api/save_emission_factors', {
        mode: 'road',
        ef: efData,
        _id: ef._id
      }).success(
      function(data,
        status, headers, config){
        if(auditDetails.Content.length != 0){
          $http.post('/api/saveauditlog',auditDetails).success(
            function(data,
              status, headers, config) {
              deferred.resolve(true);
            }).error(function(data, status, headers, config) {
              deferred.reject('Unable to save Road emission factors');
            });
          }
          deferred.resolve(true);
        }).error(function(data, status, headers, config) {
          deferred.reject('Unable to retrieve road emission factors');
        });

        return deferred.promise;
      };



      adminService.saveRailEmissionFactors = function(ef) {
        var efData = {};
        efData.vessel = ef.vessel;
        efData.gCO2 = ef.gCO2;
        efData.default = ef.default;

        var deferred = $q.defer();

        var mode = 'Rail';
        var emmissionfactors =ef;
        var oldefactors = oldrailnef;

        var auditDetails = {
          "User": UserService.user.username,
          "Mode": mode,
          "Content":[],
          "ContentType": mode + " Emission Factors",
          "Date": new Date()
        }

        if(oldefactors.gCO2 != emmissionfactors.gCO2){
          auditDetails.Content.push("gCO2 tKM value for the type " + ef.vessel + " has been changed from " + oldefactors.gCO2 + " to " + emmissionfactors.gCO2)
        }

        $http.post('/api/save_emission_factors', {
          mode: 'rail',
          ef: efData,
          _id: ef._id
        }).success(
        function(data,
          status, headers, config)  {
          if(auditDetails.Content.length != 0){
            $http.post('/api/saveauditlog',auditDetails).success(
              function(data,
                status, headers, config) {
                deferred.resolve(true);
              }).error(function(data, status, headers, config) {
                deferred.reject('Unable to save ocean old emission factors');
              });
            }
            deferred.resolve(true);
          }).error(function(data, status, headers, config) {
            deferred.reject('Unable to retrieve rail emission factors');
          });

          return deferred.promise;
        };

        adminService.saveDensityFactors = function(ef) {
          // console.log("ef",ef)

          var efData = {};
          for (p in ef) {
            if (p !== 'edit') {
              efData[p] = ef[p];
            }
          }
          var deferred = $q.defer();
          var mode = 'Density';
          var emmissionfactors =ef;
          var oldefactors = olddencityef;
          var auditDetails = {
            "User": UserService.user.username,
            "Mode": mode,
            "Content":[],
            "ContentType": "Density Factors",
            "Date": new Date()
          }
          

          if(oldefactors.air != emmissionfactors.air){
            auditDetails.Content.push("Density factor of Air value has been changed from " + oldefactors.air + " to " + emmissionfactors.air)
          }

          if(oldefactors.ocean != emmissionfactors.ocean){
            auditDetails.Content.push("Density factor of Ocean value has been changed from " + oldefactors.ocean + " to " + emmissionfactors.ocean)
          }

          if(oldefactors.rail != emmissionfactors.rail){
            auditDetails.Content.push("Density factor of Rail value has been changed from " + oldefactors.rail + " to " + emmissionfactors.rail)
          }

          if(oldefactors.road != emmissionfactors.road){
            auditDetails.Content.push("Density factor of Road value has been changed from " + oldefactors.road + " to " + emmissionfactors.road)
          }

          if(oldefactors.range.min != emmissionfactors.range.min){
            auditDetails.Content.push("Density factor of Range minimum value has been changed from " + oldefactors.range.min + " to " + emmissionfactors.range.min)
          }

          if(oldefactors.range.max != emmissionfactors.range.max){
            auditDetails.Content.push("Density factor of Range maximum value has been changed from " + oldefactors.range.max + " to " + emmissionfactors.range.max)
          }

          // console.log("auditDetails",auditDetails)
          $http.post('/api/save_emission_factors', {
            mode: 'density',
            ef: efData,
            _id: ef._id
          }).success(
          function(data,
            status, headers, config)  {
            if(auditDetails.Content.length != 0){
              $http.post('/api/saveauditlog',auditDetails).success(
                function(data,
                  status, headers, config) {
                  deferred.resolve(true);
                }).error(function(data, status, headers, config) {
                  deferred.reject('Unable to save density factors for audit');
                });
              }
              deferred.resolve(true);
            }).error(function(data, status, headers, config) {
              deferred.reject('Unable to retrieve density factors');
            });

            return deferred.promise;
          };

          adminService.getHelpData = function() {
            var deferred = $q.defer();
            var helpDetails = {
              userRole: UserService.getRole()
            };
            $http.post('/api/save_help', helpDetails).success(function(data,
              status, headers, config) {
              if (data.success) {
                console.log('Admin help retrieved successfully');
                deferred.resolve(data.helpContent);
              }
            }).error(function(data, status, headers, config) {
              deferred.reject('Unable to retrieve help data');
            });

            return deferred.promise;
          };


          // adminService.exportauditLog = function(auditdata) {
          //   console.log("auditdata",auditdata)
          //   // window.open('api/auditlogexport/'+$scope.handleConditions.tfileName, "_blank");
          
          //   var deferred = $q.defer();
          //   $http.get('/api/auditlogexport',auditdata).success(function(data,
          //     status, headers, config) {
          //     if (data.success) {

          //       console.log('Audit data export successfully');
          //       deferred.resolve(data.helpContent);
          //     }
          //   }).error(function(data, status, headers, config) {
          //     deferred.reject('Unable to export audit data');
          //   });

          //   return deferred.promise;
          // };




          adminService.saveHelpData = function(helpDetails) {
            // console.log("helpDetails",helpDetails)
            var deferred = $q.defer();
            var updateHelp = {
              userRole: UserService.getRole(),
              templateHtml: helpDetails.template_html,
              updateContent: helpDetails.content,
              date: new Date()
            };
            var content_type ;
            if(updateHelp.templateHtml == "Analysis"){
              content_type = "Analysis Guide";
            }
            else{
              content_type = "Scenarios Guide";
            }

            var auditDetails = {
              "User": UserService.user.username,
              "Mode": "User Guide",
              "Content":[],
              "ContentType": content_type,
              "Date": new Date(),
              "UpdatedContent": updateHelp.updateContent
            }

            if(updateHelp.templateHtml == "Analysis"){
              auditDetails.Content.push("Analysis Guide has been changed")
            }
            else{
              auditDetails.Content.push("Scenarios Guide has been changed")
            } 
        
        $http.post('/api/save_help', updateHelp).success(function(data,
          status, headers, config) {
          if (data.success) {
            deferred.resolve(data.helpContent);
          }
          if(auditDetails.Content.length != 0){
            $http.post('/api/saveauditlog',auditDetails).success(
              function(data,
                status, headers, config) {
                deferred.resolve(true);
              }).error(function(data, status, headers, config) {
                deferred.reject('Unable to save help data');
              });
            }
            
          }).error(function(data, status, headers, config) {
            deferred.reject('Unable to save help data');
          });

          return deferred.promise;
        };

        return adminService;
      }
      ]);
