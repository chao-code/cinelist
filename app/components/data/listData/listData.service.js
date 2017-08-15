{
  const config = {
    apiKey: "AIzaSyBfwfEXqRd__lhAeDhM83-D3Z-lL_eCSiQ",
    authDomain: "cinelist-2612d.firebaseapp.com",
    databaseURL: "https://cinelist-2612d.firebaseio.com",
    projectId: "cinelist-2612d",
    storageBucket: "cinelist-2612d.appspot.com",
    messagingSenderId: "574208852611"
  };
  window.firebase.initializeApp(config);
}

angular.module('listData.services', [])
  .factory('listData', ['$window', function($window) {

    let root = $window.firebase.database().ref();
    let listInfosRef = root.child('list_infos');
    let listFilmsRef = root.child('list_films');
    let listsByFilmRef = root.child('lists_by_film');

    function createList(list) {
      let infos = {
        subject: list.subject,
        listedBy: list.listedBy,
        description: list.description || '',
        passcode: list.passcode || '',
        createdOn: list.createdOn,
        viewCount: 0,
        filmCount: list.films.length,
        posters: {}
      };
      let films = {};
      let imdbIDs = [];

      list.films.forEach((film, index) => {
        if (index < 5) {
          infos.posters[film.imdbID] = {
            index: index,
            poster: film.poster
          };
        }
        films[film.imdbID] = {
          index: index,
          title: film.title,
          year: film.year,
          poster: film.poster,
          comment: film.comment || '',
          imdbID: film.imdbID
        };
        imdbIDs.push(film.imdbID);
      });

      let listID = listInfosRef.push().key;
      listInfosRef.child(listID).set(infos);
      listFilmsRef.child(listID).set(films);
      addListsByFilms(listID, imdbIDs);

      return listID;
    }

    function addListsByFilms(listID, imdbIDs) {
      imdbIDs.forEach(imdbID => {
        listsByFilmRef
          .child(imdbID + '/' + listID)
          .set(true);
      });
    }

    function removeListsByFilms(listID, films) {
      for (let imdbID in films) {
        if (films[imdbID]) {
          listsByFilmRef
            .child(imdbID + '/' + listID)
            .remove();
          
        }
      }
    }

    function getList(listID) {

      return Promise.all([
        listInfosRef.child(listID).once('value'),
        listFilmsRef.child(listID).once('value')
      ]).then(([infosSnapshot, filmsSnapshot]) => {
        if (!infosSnapshot.exists() || !filmsSnapshot.exists()) {
          return null;
        }

        let infos = infosSnapshot.val();
        let list = {
          subject: infos.subject,
          listedBy: infos.listedBy,
          description: infos.description,
          passcode: infos.passcode,
          createdOn: infos.createdOn,
          editedOn: infos.editedOn,
          filmCount: infos.filmCount,
          films: []
        };

        filmsSnapshot.forEach(filmSnapshot => {
          let film = filmSnapshot.val();
          list.films[film.index] = {
            title: film.title,
            year: film.year,
            poster: film.poster,
            comment: film.comment,
            imdbID: film.imdbID
          };
        });

        incrementviewCount(listID);
        return list;
      });
    }

    function incrementviewCount(listID) {
      return listInfosRef
        .child(listID + '/viewCount')
        .transaction(count => ++count);
    }

    function updatePosters(listID, films) {
      let promises = [];
      films.forEach(film => {
        let imdbID = film.imdbID;
        let poster = film.poster;
        if (film.index < 5) {
          promises.push(listInfosRef.child(listID + '/posters/' + imdbID).set(poster));
        }
        promises.push(listFilmsRef.child(listID + '/' + imdbID + '/poster').set(poster));
      });

      return Promise.all(promises);
    }

    function updateList(listID, list) {
      let infos = {
        subject: list.subject,
        listedBy: list.listedBy,
        description: list.description || '',
        passcode: list.passcode || '',
        editedOn: list.editedOn,
        filmCount: list.films.length,
        posters: {}
      };
      let films = {};
      let imdbIDs = [];

      list.films.forEach((film, index) => {
        if (index < 5) {
          infos.posters[film.imdbID] = {
            index: index,
            poster: film.poster
          };
        }
        films[film.imdbID] = {
          index: index,
          title: film.title,
          year: film.year,
          poster: film.poster,
          comment: film.comment || '',
          imdbID: film.imdbID
        };
        imdbIDs.push(film.imdbID);
      });

      removeListsByFilms(listID, list.removedFilms);
      addListsByFilms(listID, imdbIDs);

      return Promise.all([
        listInfosRef.child(listID).update(infos),
        listFilmsRef.child(listID).set(films)
      ]);
    }

    function deleteList(listID) {
      return listFilmsRef.child(listID).once('value')
        .then(filmsSnapshot => {
          filmsSnapshot.forEach(filmSnapshot => {
            let imdbID = filmSnapshot.key;
            listsByFilmRef
              .child(imdbID)
              .child(listID)
              .remove();
          });

          return Promise.all([
            listInfosRef.child(listID).remove(),
            listFilmsRef.child(listID).remove()
          ]);
        });
    }

    function getPopularLists(num) {
      return listInfosRef
        .orderByChild('viewCount')
        .limitToLast(num)
        .once('value')
        .then(snapshots => {
          let lists = [];
          snapshots.forEach(snapshot => {
            let listInfo = snapshot.val();
            let list = toListBrief(listInfo);
            list.listID = snapshot.key;
            lists.unshift(list);
          });
          return lists;
        });
    }

    function toListBrief(listInfo) {
      let list = {
        subject: listInfo.subject,
        filmCount: listInfo.filmCount,
        listedBy: listInfo.listedBy,
        description: listInfo.description,
        posters: []
      };
      for (let imdbID in listInfo.posters) {
        let film = listInfo.posters[imdbID];
        list.posters[film.index] = film.poster;
      }
      return list;
    }

    function getRecentLists(num) {
      return listInfosRef
        .orderByChild('createdOn')
        .limitToLast(num)
        .once('value')
        .then(snapshots => {
          let lists = [];
          snapshots.forEach(snapshot => {
            let listInfo = snapshot.val();
            let list = toListBrief(listInfo);
            list.listID = snapshot.key;
            lists.unshift(list);
          });
          return lists;
        });
    }

    function getRelatedLists(imdbID, num) {
      return listsByFilmRef
        .child(imdbID)
        .orderByKey()
        .limitToLast(num)
        .once('value')
        .then(snapshots => {
          let promises = [];
          snapshots.forEach(snapshot => {
            let listID = snapshot.key;
            let promise = listInfosRef.child(listID).once('value');
            promises.push(promise);
          });
          return Promise.all(promises)
            .then(snapshots => {
              let lists = [];
              snapshots.forEach(snapshot => {
                let listInfo = snapshot.val();
                let list = toListBrief(listInfo);
                list.listID = snapshot.key;
                lists.unshift(list);
              });
              return lists;
            });
        });
    }

    return {
      createList,
      getList,
      updatePosters,
      updateList,
      deleteList,
      getPopularLists,
      getRecentLists,
      getRelatedLists
    };
  }]);