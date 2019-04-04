import StoreEntity from "./store-entity";
import * as StoreSchema from "./store-schema";
import { entityQueries } from "./api/index";

describe("Store Entity", () => {
  describe("Entity", () => {
    let entity = null;

    beforeAll(() => {
      const link = "bodyValues";
      entity = new StoreEntity(link, StoreSchema[link], entityQueries[link]);
    });

    test("Create", () => {
      expect(entity).toBeDefined();
    });
  });
});
