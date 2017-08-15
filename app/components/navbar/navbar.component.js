angular.module('navbar.components', ['filmData.services'])
  .component('myNavbar', {
    templateUrl: 'components/navbar/navbar.html',
    controller: 'NavbarCtrl as navbarCtrl'
  })
  .controller('NavbarCtrl', ['$scope', 'filmData', function($scope, filmData) {
      this.query = '';
      this.option = {debounce: 500};
      this.results = null;

      this.search = () => {
        let query = this.query;
        if (query == '') {
          this.results = null;
        } else {
          filmData.searchFilms(query)
            .then(results => this.results = results);
        }
      }

      $scope.$on('$locationChangeSuccess', () => {
        this.query = '';
        this.results = null;
      });
  }]);