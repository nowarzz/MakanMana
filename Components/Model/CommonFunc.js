import PouchDB from 'pouchdb-adapters-rn';

export default class CommonFunc {
  db;
  constructor() {
    this.db = new PouchDB("https://couchdb-442287.smileupps.com/makanmana");
  }


}