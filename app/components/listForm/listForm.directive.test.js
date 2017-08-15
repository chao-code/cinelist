describe('List Form Directive', function() {

  let ctrl, scope, service;

  beforeEach(module('listForm.directives'));

  beforeEach(inject(function($controller, $rootScope, $q) {
    scope = Object.assign($rootScope.$new(), {
      list: {
        subject: '',
        listedBy: '',
        passcode: '',
        description: '',
        films: [
          {imdbID: 'id1'},
          {imdbID: 'id2'},
          {imdbID: 'id3'}
        ]
      },
      onSave: () => {},
      onCancel: () => {}
    });
    service = {
      searchFilms: query => $q.resolve([{
        poster: 'poster',
        title: 'title',
        year: 'year',
        imdbID: 'imdbID'
      }])
    }
    ctrl = $controller('ListFormCtrl', {
      $scope: scope,
      filmData: service
    });
  }));

  it('should search films by title', function() {

    expect(ctrl.query).toEqual('');
    expect(ctrl.results).toBeNull();
    ctrl.query = 'title';
    ctrl.search();

    scope.$digest();
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

  it('should add a film to list', function() {
    let films = scope.list.films;

    ctrl.query = 'some title';
    ctrl.addFilm({imdbID: 'id1'});
    expect(films).toEqual([
      {imdbID: 'id1'},
      {imdbID: 'id2'},
      {imdbID: 'id3'}
    ]);
    expect(ctrl.query).toBe('');
    expect(ctrl.results).toBeNull();
    expect(ctrl.message).toBeTruthy();

    ctrl.addFilm({imdbID: 'id4'});
    expect(films).toEqual([
      {imdbID: 'id1'},
      {imdbID: 'id2'},
      {imdbID: 'id3'},
      {imdbID: 'id4'}
    ]);
    expect(ctrl.query).toBe('');
    expect(ctrl.results).toBeNull();
    expect(ctrl.message).toBeFalsy();
  });

  it('should move a film to new index', function() {
    let films = scope.list.films;

    ctrl.moveFilm(2, 0);
    expect(films).toEqual([
      {imdbID: 'id3'},
      {imdbID: 'id1'},
      {imdbID: 'id2'}
    ]);
  });

  it('should remove a film from list', function() {
    let films = scope.list.films;

    ctrl.removeFilm(1);
    expect(films).toEqual([
      {imdbID: 'id1'},
      {imdbID: 'id3'},
    ]);
  });

  it('should save the created list', function() {
    spyOn(scope, 'onSave').and.stub();

    ctrl.save();
    expect(ctrl.showError).toBeTruthy();
    expect(scope.onSave).not.toHaveBeenCalled();

    scope.list.subject = 'subject';
    scope.list.listedBy = 'listed by';
    ctrl.save();
    expect(scope.onSave).toHaveBeenCalledWith({
      list: {
        subject: 'subject',
        listedBy: 'listed by',
        passcode: '',
        description: '',
        films: [
          {imdbID: 'id1'},
          {imdbID: 'id2'},
          {imdbID: 'id3'}
        ]
      }
    });
  });

  it('should cancel editing the list', function() {
    spyOn(scope, 'onCancel').and.stub();
    ctrl.cancel();
    expect(scope.onCancel).toHaveBeenCalled();
  });

});