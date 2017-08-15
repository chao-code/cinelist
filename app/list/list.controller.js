angular.module('cinelistApp')
  .controller('ListCtrl', ['$routeParams', '$scope', 'listData', 'filmData',
    function($routeParams, $scope, listData, filmData) {
      let listID = $routeParams.listID;
      this.list = {};

      this.orderBys = [
        {label: 'List Order', value: 'index'},
        {label: 'Title', value: 'title'},
        {label: 'Year', value: '-year'},
        {label: 'Metascore', value: '-metascore'},
        {label: 'IMDb Rating', value: '-imdbRating'},
        {label: 'Rotten Tomatoes', value: '-rottenTomatoes'},
      ];
      this.orderBy = 'index'

      this.shareLinks = {
        twitter: '',
        facebook: 'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(location.href)
      };
      this.suggestedLists = [];

      this.modal = {
        error: false,
        passcode: '',
        check: () => {
          if (this.modal.passcode == this.list.passcode) {
            $('#checkModal').modal('hide');
            this.modal.error = false;
            this.modal.passcode = '';
            this.edit.list = angular.copy(this.list);
            this.edit.isOn = true;
          } else {
            this.modal.error = true;
          }
        }
      };

      this.edit = {
        isOn: false,
        list: {},
        save: list => {
          list.editedOn = Date.now();

          let editedList = angular.copy(list);
          editedList.removedFilms = {};
          this.list.films.forEach(film =>
            editedList.removedFilms[film.imdbID] = true
          );
          list.films.forEach(film => 
            delete editedList.removedFilms[film.imdbID]
          );

          listData.updateList(listID, editedList);
          this.list = list;
          this.shareLinks.twitter = `https://twitter.com/intent/tweet?text="${list.subject}"%20by%20${list.listedBy}%20on%20CineList:&url=${location.href}`;
          this.edit.list = {};
          this.edit.isOn = false;
          document.title = list.subject + ' - CineList';
        },
        cancel: () => {
          this.edit.list = {};
          this.edit.isOn = false;
        }
      };

      listData.getList(listID).then(list => {
        document.title = list.subject + ' - CineList';

        $scope.$apply(() => {
          this.list = list;
          this.shareLinks.twitter = `https://twitter.com/intent/tweet?text="${list.subject}"%20by%20${list.listedBy}%20on%20CineList:&url=${location.href}`;
        });

        let newPosters = [];
        let n = list.films.length;
        list.films.forEach((film, index) => {
          filmData.getFilmDetail(film.imdbID).then(detail => {
            film.metascore = detail['Metascore'];
            film.imdbRating = detail['IMDb Rating'];
            film.rottenTomatoes = detail['Rotten Tomatoes'];

            if (film.poster != detail.Poster) {
              film.poster = detail.Poster;
              newPosters.push({
                imdbID: film.imdbID,
                poster: film.poster,
                index: index
              });
            }
            if (--n == 0 && newPosters.length)
              listData.updatePosters(listID, newPosters);
          });
        });
      });

      listData.getRecentLists(5)
        .then(lists => $scope.$apply(() => this.suggestedLists = lists));
  }]);