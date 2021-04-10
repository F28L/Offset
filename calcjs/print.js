CarbonCalculator.controller('PrintController', ['$scope', '$rootScope',
  '$http', '$mdDialog', '$q', '$log', '$timeout',
  function($scope, $rootScope, $http, $mdDialog, $q, $log, $timeout) {

    $rootScope.printReport = function(elId) {
      var el = $('#' + elId);
      var cache_width = el.width();
      var a4 = [595.28, 841.89]; // for a4 size paper width and height
      // el.width((a4[0] * 1.33333) - 80).css('max-width', 'none');

      html2canvas(el, {
        imageTimeout: 2000,
        removeContainer: true,
        onrendered: function(canvas) {
          var img = canvas.toDataURL("image/png");

          var doc = new jsPDF();
          doc.addImage(img, 'PNG', 20, 20);
          doc.save('sample-file.pdf');
          // el.width(cache_width);
        }
      });
    };
  }
]);
