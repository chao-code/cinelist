angular.module('cinelistApp')
  .controller('FilmCtrl', ['$routeParams', '$scope', 'filmData', 'listData',
    function($routeParams, $scope, filmData, listData) {
      let filmID = $routeParams.filmID;
      this.film = {};

      this.infoKeys = [
        'Genre',
        'Rated',
        'Runtime',
        'Released',
        'Language',
        'Country',
        'Production',
        'Metascore',
        'IMDb Rating',
        'Rotten Tomatoes'
      ];
      this.crewKeys = [
        'Director',
        'Writers',
        'Cast'
      ];

      this.shareLinks = {
        twitter: '',
        facebook: 'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(location.href)
      };
      this.suggestedLists = [];
      this.suggestedListsKind = 'Related';

      filmData.getFilmDetail(filmID).then(film => {
        document.title = `${film.Title} (${film.Year}) - CineList`;
        this.film = film;
        this.shareLinks.twitter = `https://twitter.com/intent/tweet?text=${film.Title}%20(${film.Year})%20on%20CineList:&url=${location.href}`;
      });

      listData.getRelatedLists(filmID, 5)
        .then(relatedLists => {
          if (relatedLists.length) {
            $scope.$apply(() => this.suggestedLists = relatedLists);
          } else {
            listData.getRecentLists(5)
              .then(recentLists => $scope.$apply(() => {
                this.suggestedLists = recentLists;
                this.suggestedListsKind = 'Recent';
              }));
          }
        });
  }]);