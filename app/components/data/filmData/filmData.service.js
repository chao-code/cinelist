angular.module('filmData.services', [])
  .factory('filmData', ['$http', '$q', function($http, $q) {
    const base = '//bernoulli-io.herokuapp.com/api/';

    let _popularFilms = [];
    function getPopularFilms() {
      if (_popularFilms.length)
        return $q.resolve(_popularFilms);

      const url = base + 'movies';
      return $http.get(url).then(
        res => _popularFilms = res.data.mostPopular,
        err => _popularFilms
      );
    }

    let _films = {};
    function getFilmDetail(filmID) {
      if (_films[filmID])
        return $q.resolve(_films[filmID]);

      const url = base + 'movies/' + filmID;
      return $http.get(url).then(
        res => {
          let data = res.data;
          let film = {
            Title: data.Title,
            Year: data.Year,
            Poster: data.Poster,
            Genre: data.Genre,
            Rated: data.Rated,
            Runtime: data.Runtime,
            Released: data.Released,
            Language: data.Language,
            Country: data.Country,
            Production: data.Production,
            Plot: data.Plot,
            Director: data.Director.split(', '),
            Writers: data.Writer.split(', '),
            Cast: data.Actors.split(', '),
            imdbID: data.imdbID
          };

          data.Ratings.forEach(rating => {
            switch (rating.Source) {
              case 'Internet Movie Database':
                film['IMDb Rating'] = rating.Value;
                break;
              case 'Rotten Tomatoes':
                film['Rotten Tomatoes'] = rating.Value;
                break;
              case 'Metacritic':
                film['Metascore'] = rating.Value;
                break;
            }
          });

          ['IMDb Rating', 'Rotten Tomatoes', 'Metascore'].forEach(key => {
            if (!film[key]) film[key] = 'N/A';
          });

          _films[filmID] = film;
          return film;
        },
        err => ({})
      );
    }

    function searchFilms(title) {
      const url = base + 'search?title=' + title;
      return $http.get(url).then(
        res => {
          if (res.data.Response == 'True') {
            return res.data.Search.map(film => ({
              poster: film.Poster,
              title: film.Title,
              year: film.Year,
              imdbID: film.imdbID
            }));
          }
          return [];
        },
        err => []
      );
    }

    return {
      getPopularFilms,
      getFilmDetail,
      searchFilms
    };
  }]);