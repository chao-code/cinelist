angular.module('newlines.filters', [])
  .filter('newlines', function() {
    return text => text? text.replace(/\n/g, '<br>') : text
  });