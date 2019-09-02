// Type 2: Persistent datastore with manual loading
const Datastore = require("nedb");

class DatabaseUtility {
  constructor() {
    this.db = this.setupDatabase();
  }

  setupDatabase() {
    const db = new Datastore({
      filename: "/tmp/cryptoDatabase",
      autoload: true
    });
    // Using a unique constraint with the index
    db.ensureIndex({ fieldName: "fileName", unique: true }, function(err) {});

    db.loadDatabase();
    return db;
  }

  insertCryptoPair({ fileName, key, iv }) {
    let doc = {
      fileName: fileName,
      key: key,
      iv: iv
    };

    return new Promise((resolve, reject) => {
      this.db.insert(doc, function(err, docs) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  }

  async getCryptoPair({ fileName }) {
    return new Promise((resolve, reject) => {
      this.db.find({ fileName: fileName }, (err, docs) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  }
}

module.exports = DatabaseUtility;
