describe('Navbar Component', function() {

  let ctrl, httpBackend;
  const url = '//bernoulli-io.herokuapp.com/api/search?title=title';

  beforeEach(module('navbar.components'));

  beforeEach(inject(function($controller, $httpBackend) {
    httpBackend = $httpBackend;

    let scope = {$on: function() {}};
    ctrl = $controller('NavbarCtrl', {$scope: scope});
  }));

  it('should handle search results', function() {
    httpBackend.expectGET(url)
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

    expect(ctrl.query).toEqual('');
    expect(ctrl.results).toBeNull();
    ctrl.query = 'title';
    ctrl.search();

    httpBackend.flush();

    expect(ctrl.query).toEqual('title');
    expect(ctrl.results).toEqual([{
      poster: 'poster',
      title: 'title',
      year: 'year',
      imdbID: 'imdbID'
    }]);

    ctrl.query = '';
    ctrl.search();
    expect(ctrl.results).toBeNull();
  });

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

});