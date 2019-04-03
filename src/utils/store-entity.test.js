import StoreEntity from "./store-entity";
import * as StoreSchema from "./store-schema";
import collections from "./api/collections";
import { entityQueries } from "./api/index";

describe("Store Entity", () => {
  describe("Entity", () => {
    let entity = null;

    beforeAll(() => {
      const collectionName = "BodyValueCollection";
      const link = collections[collectionName].link;
      entity = new StoreEntity(link, StoreSchema[link], entityQueries[link]);
    });

    test("Create", () => {
      expect(entity).toBeDefined();
    });
  });
});
