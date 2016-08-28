import idb from 'idb';

const dbPromise = idb.open('chat-store', 1, upgradeDB => {
  upgradeDB.createObjectStore('chats',{ keyPath: 'id' });
});

const idbKeyval = {
  set(val){
    dbPromise.then(db => {
      const tx = db.transaction('chats', 'readwrite');
      tx.objectStore('chats').put(val);
      return tx.complete;
    });
  },
  get(key,cb){
    dbPromise.then(db => {
      return db.transaction('chats')
        .objectStore('chats').get(key);
    }).then(cb);
  },
  getAll(cb){
    dbPromise.then(db => {
      return db.transaction('chats')
        .objectStore('chats').getAll();
    }).then(cb);
  }

};

module.exports = idbKeyval;