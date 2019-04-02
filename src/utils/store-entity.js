export class StoreEntity {
  constructor(collection) {
    this.collection = collection;

    this.dataReducer = null;
    this.listReducer = null;

    this.sagas = [];
  }
}
