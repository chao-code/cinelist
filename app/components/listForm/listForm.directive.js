angular.module('listForm.directives', ['filmData.services'])
  .directive('myListForm', () => ({
    templateUrl: 'components/listForm/listForm.html',
    controller: 'ListFormCtrl as formCtrl',
    scope: {
      list: '=',
      onSave: '&',
      onCancel: '&'
    }
  }))
  .controller('ListFormCtrl', ['$scope','filmData', function($scope, filmData) {
    this.query = '',
    this.option = {debounce: 500};
    this.results = null;
    this.search = () => {
      let query = this.query;
      if (query) {
        filmData.searchFilms(query)
          .then(results => this.results = results);
      } else {
        this.results = null;
      }
    }

    let filmsInList = {};
    $scope.list.films.forEach(film => filmsInList[film.imdbID] = true);

    this.addFilm = film => {
      if (filmsInList[film.imdbID]) {
        this.query = '';
        this.results = null;
        this.message = `${film.title} (${film.year}) is already in the list.`;
      } else {
        $scope.list.films.push(film);
        filmsInList[film.imdbID] = true;
        this.query = '';
        this.results = null;
        this.message = null;
      }
    }

    this.moveFilm = (index, newIndex) => {
      if (index == newIndex) return

      let films = $scope.list.films;
      let film = films.splice(index, 1)[0];
      if (newIndex < films.length) {
        films.splice(newIndex, 0, film);
      } else {
        films.push(film);
      }
    }

    this.keyUp = (event, index) => {
      if (event.keyCode != 13) return

      let newIndex = event.target.value - 1;
      event.target.value = index + 1;
      if (!Number.isNaN(newIndex) && newIndex % 1 == 0 && newIndex >= 0)
        this.moveFilm(index, newIndex);
    }

    this.removeFilm = index => {
      let films = $scope.list.films;
      let film = films[index];
      delete filmsInList[film.imdbID];
      films.splice(index, 1);
    }

    this.save = () => {
      let list = $scope.list;
      if (list.subject && list.listedBy && list.films.length)
        $scope.onSave({list});
      else
        this.showError = true;
    }

    this.cancel = () => {
      $scope.onCancel();
    }

  }]);