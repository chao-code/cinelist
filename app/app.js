angular.module('cinelistApp',
              ['ngRoute',
               'ngSanitize',
               'newlines.filters',
               'posterCrop.filters',
               'filmData.services',
               'listData.services',
               'navbar.components',
               'listsWidget.components',
               'listForm.directives'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'main/main.html',
        controller: 'MainCtrl as mainCtrl'
      })
      .when('/film/:filmID', {
        templateUrl: 'film/film.html',
        controller: 'FilmCtrl as filmCtrl'
      })
      .when('/list/:listID', {
        templateUrl: 'list/list.html',
        controller: 'ListCtrl as listCtrl'
      })
      .when('/newlist', {
        templateUrl: 'newlist/newlist.html',
        controller: 'NewListCtrl as newCtrl'
      })
      .when('/newlist/with/:filmID', {
        templateUrl: 'newlist/newlist.html',
        controller: 'NewListCtrl as newCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  }]);