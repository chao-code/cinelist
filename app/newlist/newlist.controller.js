angular.module('cinelistApp')
  .controller('NewListCtrl', ['$routeParams', '$location', 'filmData', 'listData',
    function($routeParams, $location, filmData, listData) {
      document.title = 'New List - CineList';

      let emptyList = {
        subject: '',
        listedBy: '',
        passcode: '',
        description: '',
        films: []
      }

      if ($routeParams.filmID) {
        let filmID = $routeParams.filmID;
        filmData.getFilmDetail(filmID)
          .then(film => {
            if (film.imdbID) {
              emptyList.films.push({
                title: film.Title,
                year: film.Year,
                poster: film.Poster,
                imdbID: film.imdbID
              });
            }
            this.list = emptyList;
          });
      } else {
        this.list = emptyList;
      }

      this.save = list => {
        list.createdOn = Date.now();
        let listID = listData.createList(list);
        $location.url('/list/' + listID);
      }

      this.cancel = () => {
        window.history.back();
      }
    }]);