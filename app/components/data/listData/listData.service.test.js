describe('ListData Service', function() {

  let service;
  let lists, films, listIDs, timeStamps;

  beforeEach(module('listData.services'));

  beforeEach(inject(function(listData) {
    service = listData;
  }));

  beforeEach(function() {
    films = [];
    for (let i = 0; i < 5; i++) {
      films[i] = {
        title: 'film' + i,
        year: '200' + i,
        poster: i + '.img',
        imdbID: 'tt' + i,
        comment: ''
      };
    }

    lists = [];
    timeStamps = [];
    for (let i = 0; i < 5; i++) {
      lists[i] = {
        subject: 'list' + i,
        listedBy: 'user' + i,
        description: '',
        createdOn: timeStamps[i] = Date.now() - i * 100000,
        passcode: '123',
        films: films.slice(i)
      };
    }

    listIDs = [];
    lists.forEach((list, index) =>
      listIDs[index] = service.createList(list)
    );
  });

  it('should create and read a list', function(done) {
    service.getList(listIDs[0])
      .then(list => {
        expect(list).toEqual({
          subject: 'list0',
          listedBy: 'user0',
          description: '',
          createdOn: timeStamps[0],
          editedOn: undefined,
          passcode: '123',
          films: films,
          filmCount: 5
        });
        done();
      });
  });

  it('should update posters of a list', function(done) {
    service.updatePosters(listIDs[3], [
      {
        index: 0,
        imdbID: 'tt3',
        poster: '4.img'
      },
      {
        index: 1,
        imdbID: 'tt4',
        poster: '5.img'
      }
    ]).then(() => {
      return service.getList(listIDs[3]);
    }).then(list => {
      films[3].poster = '4.img';
      films[4].poster = '5.img';

      expect(list).toEqual({
        subject: 'list3',
        listedBy: 'user3',
        description: '',
        createdOn: timeStamps[3],
        editedOn: undefined,
        passcode: '123',
        films: films.slice(3),
        filmCount: 2
      });
      done();
    });
  });

  it('should update a list', function(done) {
    let editedOn = Date.now();

    service.updateList(listIDs[1], {
      subject: 'list',
      listedBy: 'user',
      editedOn: editedOn,
      passcode: '123',
      description: 'description',
      films: films.slice(2),
      removedFilms: {'tt1': true}
    }).then(() => {
      return service.getList(listIDs[1]);
    }).then(list => {
      expect(list).toEqual({
        subject: 'list',
        listedBy: 'user',
        editedOn: editedOn,
        createdOn: timeStamps[1],
        passcode: '123',
        description: 'description',
        films: films.slice(2),
        filmCount: 3
      });
      done();
    });
  });

  it('should delete a list', function(done) {
    service.deleteList(listIDs[0])
      .then(() => service.getList(listIDs[0]))
      .then(list => {
        expect(list).toBeNull();
        done();
      });
  });

  it('should get popular lists', function(done) {
    service.getList(listIDs[3])
      .then(() => service.getList(listIDs[2]))
      .then(() => service.getList(listIDs[3]))
      .then(() => service.getPopularLists(2))
      .then(popularLists => {
        expect(popularLists).toEqual([
          {
            subject: 'list3',
            filmCount: 2,
            listedBy: 'user3',
            description: '',
            posters: ['3.img', '4.img'],
            listID: listIDs[3]
          },
          {
            subject: 'list2',
            filmCount: 3,
            listedBy: 'user2',
            description: '',
            posters: ['2.img', '3.img', '4.img'],
            listID: listIDs[2]
          }
        ]);
        done();
      });
  });

  it('should get recent lists', function(done) {
    service.getRecentLists(2)
      .then(recentLists => {
        expect(recentLists).toEqual([
          {
            subject: 'list0',
            filmCount: 5,
            listedBy: 'user0',
            description: '',
            posters: ['0.img', '1.img', '2.img', '3.img', '4.img'],
            listID: listIDs[0]
          },
          {
            subject: 'list1',
            filmCount: 4,
            listedBy: 'user1',
            description: '',
            posters: ['1.img', '2.img', '3.img', '4.img'],
            listID: listIDs[1]
          }
        ]);
        done();
      });
  });

  it('should get related lists of a film', function(done) {
    service.getRelatedLists(films[2].imdbID, 5)
      .then(relatedLists => {
        expect(relatedLists).toEqual([
          {
            subject: 'list2',
            filmCount: 3,
            listedBy: 'user2',
            description: '',
            posters: ['2.img', '3.img', '4.img'],
            listID: listIDs[2]
          },
          {
            subject: 'list1',
            filmCount: 4,
            listedBy: 'user1',
            description: '',
            posters: ['1.img', '2.img', '3.img', '4.img'],
            listID: listIDs[1]
          },
          {
            subject: 'list0',
            filmCount: 5,
            listedBy: 'user0',
            description: '',
            posters: ['0.img', '1.img', '2.img', '3.img', '4.img'],
            listID: listIDs[0]
          }
        ]);
        done();
      });
  });

  afterEach(function(done) {
    Promise.all(
      listIDs.map(listID => service.deleteList(listID))
    ).then(done);
  });

});