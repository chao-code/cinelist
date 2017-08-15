angular.module('cinelistApp')
  .controller('MainCtrl', ['$scope', 'mainSvc', 'filmData', 'listData',
    function($scope, mainSvc, filmData, listData) {
      document.title = 'CineList'
      this.popularFilms = [];
      this.numShown = mainSvc.numShown;
      this.popularLists = [];

      this.showMore = () => {
        this.numShown = mainSvc.showMore();
      };

      filmData.getPopularFilms()
        .then(films => this.popularFilms = films);

      listData.getPopularLists(5)
        .then(lists => $scope.$apply(() => this.popularLists = lists));
  }])
  .service('mainSvc', function() {
    this.numShown = 4;
    this.showMore = () => {
      if (this.numShown < 100)
        return this.numShown = this.numShown + 8;
      return 100;
    }
  });