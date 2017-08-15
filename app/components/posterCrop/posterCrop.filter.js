angular.module('posterCrop.filters', [])
  .filter('posterCrop', function() {
    return poster => poster? poster.slice(0, poster.length - 4) + '_CR0,0,300,444_AL_.jpg' : '';
  });