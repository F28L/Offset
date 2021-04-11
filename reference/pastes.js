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

  