angular.module('listsWidget.components', [])
  .component('myListsWidget', {
    templateUrl: 'components/listsWidget/listsWidget.html',
    bindings: {
      compact: '=',
      lists: '='
    }
  });