describe('FilmData Service', function() {

  let service, httpBackend;
  const base = '//bernoulli-io.herokuapp.com/api/';

  beforeEach(module('filmData.services'));

  beforeEach(inject(function(filmData, $httpBackend) {
    service = filmData;
    httpBackend = $httpBackend;
  }));

  it('should get popular films and cach them', function() {
    let data;

    httpBackend.expectGET(base + 'movies')
      .respond({
        mostPopular: [{title: 'some film'}]
      });
    service.getPopularFilms().then(res => data = res);
    httpBackend.flush();
    expect(data).toEqual([{title: 'some film'}]);

    service.getPopularFilms().then(res => data = res);
    expect(data).toEqual([{title: 'some film'}]);
  });

  it('should send empty popular films when server down', function() {
    let data;

    httpBackend.expectGET(base + 'movies')
      .respond(400);
    service.getPopularFilms().then(res => data = res);
    httpBackend.flush();
    expect(data).toEqual([]);
  });

  it('should get film detail and cache it', function() {
    let data;
    let filmID = 'tt1234567';

    httpBackend.expectGET(base + 'movies/' + filmID)
      .respond({
        Actors: 'actor1, actor2',
        Country: 'country',
        Director: 'director',
        Genre: 'genre',
        Language: 'language',
        Plot: 'plot',
        Poster: 'poster',
        Production: 'production',
        Rated: 'rated',
        Ratings: [
          {Source: 'Internet Movie Database', Value: '8.0/10'},
          {Source: 'Metacritic', Value: '76/100'}
        ],
        Released: 'released',
        Runtime: 'runtime',
        Title: 'title',
        Writer: 'writer',
        Year: 'year',
        imdbID: 'imdbID'
      });
    service.getFilmDetail(filmID).then(res => data = res);
    httpBackend.flush();
    expect(data).toEqual({
      Title: 'title',
      Year: 'year',
      Poster: 'poster',
      Genre: 'genre',
      Rated: 'rated',
      Runtime: 'runtime',
      Released: 'released',
      Language: 'language',
      Country: 'country',
      Production: 'production',
      Metascore: '76/100',
      'IMDb Rating': '8.0/10',
      'Rotten Tomatoes': 'N/A',
      Plot: 'plot',
      Director: ['director'],
      Writers: ['writer'],
      Cast: ['actor1', 'actor2'],
      imdbID: 'imdbID'
    });

    service.getFilmDetail(filmID).then(res => data = res);
    expect(data).toEqual({
      Title: 'title',
      Year: 'year',
      Poster: 'poster',
      Genre: 'genre',
      Rated: 'rated',
      Runtime: 'runtime',
      Released: 'released',
      Language: 'language',
      Country: 'country',
      Production: 'production',
      Metascore: '76/100',
      'IMDb Rating': '8.0/10',
      'Rotten Tomatoes': 'N/A',
      Plot: 'plot',
      Director: ['director'],
      Writers: ['writer'],
      Cast: ['actor1', 'actor2'],
      imdbID: 'imdbID'
    });
  });

  it('should send empty film detail when server down', function() {
    let data;
    let filmID = 'tt1234567';

    httpBackend.expectGET(base + 'movies/' + filmID)
      .respond(400);
    service.getFilmDetail(filmID).then(res => data = res);
    httpBackend.flush();
    expect(data).toEqual({});
  });

  it('should search films by title', function() {
    let data;
    let title = 'some film';

    httpBackend.expectGET(base + 'search?title=' + title)
      .respond({
        Response: 'True',
        Search: [{
          Poster: 'poster',
          Title: 'title',
          Type: 'type',
          Year: 'year',
          imdbID: 'imdbID'
        }]
      });

    service.searchFilms(title).then(res => data = res);

    httpBackend.flush();

    expect(data).toEqual([{
      poster: 'poster',
      title: 'title',
      year: 'year',
      imdbID: 'imdbID'
    }]);

    httpBackend.expectGET(base + 'search?title=' + title)
      .respond({
        Response: 'False'
      });

    service.searchFilms(title).then(res => data = res);

    httpBackend.flush();

    expect(data).toEqual([]);

    httpBackend.expectGET(base + 'search?title=' + title)
      .respond(400);

    service.searchFilms(title).then(res => data = res);

    httpBackend.flush();

    expect(data).toEqual([]);
  });

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });
});