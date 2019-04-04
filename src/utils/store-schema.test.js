import { normalize } from "normalizr";
import StoreSchema from "./store-schema";

describe("Store Schema", () => {
  describe("Normalize", () => {
    const db = {
      bodyValues: [
        {
          id: "1",
          name: "value1",
        },
        {
          id: "2",
          name: "value2",
        },
      ],
      bodyParams: [
        {
          id: "11",
          name: "param1",
          values: ["1", "2"],
        },
      ],
      entities: [
        {
          id: "111",
          name: "entity1",
          bodyParam: "11",
        },
      ],
      positions: [
        {
          id: "1111",
          name: "position1",
          entities: ["111"],
        },
      ],
      employees: [
        {
          id: "11111",
          name: "employee1",
          positions: [1111],
          bodyParams: [{ bodyParam: "11", bodyValue: "1" }],
          history: [],
        },
      ],
      history: [
        {
          id: "111111",
          date: "12324324324",
          positions: ["1111"],
          employee: "11111",
          entity: "111",
          bodyValue: "1",
        },
      ],
    };

    beforeAll(() => {});

    test("bodyValues", () => {
      const alias = "bodyValues";

      const schema = StoreSchema[alias];
      const data = normalize(db[alias], [schema]);

      expect(Object.keys(data.entities[alias]).length).toBe(2);
      expect(data.result.length).toBe(2);
    });

    test("employees", () => {
      const alias = "employees";

      const schema = StoreSchema[alias];
      const data = normalize(db[alias], [schema]);

      expect(Object.keys(data.entities[alias]).length).toBe(1);
      expect(data.result.length).toBe(1);
    });

    test("history", () => {
      const alias = "history";

      const schema = StoreSchema[alias];
      const data = normalize(db[alias], [schema]);

      expect(Object.keys(data.entities[alias]).length).toBe(1);
      expect(data.result.length).toBe(1);
    });
  });

  describe("Denormalize", () => {
    const db = {
      bodyValues: [
        {
          id: "1",
          name: "value1",
        },
        {
          id: "2",
          name: "value2",
        },
      ],
      bodyParams: [
        {
          id: "11",
          name: "param1",
          values: ["1", "2"],
        },
      ],
      entities: [
        {
          id: "111",
          name: "entity1",
          bodyParam: "11",
        },
      ],
      positions: [
        {
          id: "1111",
          name: "position1",
          entities: ["111"],
        },
      ],
      employees: [
        {
          id: "11111",
          name: "employee1",
          positions: [1111],
          bodyParams: [{ bodyParam: "11", bodyValue: "1" }],
          history: [],
        },
      ],
      history: [
        {
          id: "111111",
          date: "12324324324",
          positions: ["1111"],
          employee: "11111",
          entity: "111",
          bodyValue: "1",
        },
      ],
    };

    beforeAll(() => {});

    test("bodyValues", () => {
      const alias = "bodyValues";

      const schema = StoreSchema[alias];
      const data = normalize(db[alias], [schema]);

      expect(Object.keys(data.entities[alias]).length).toBe(2);
      expect(data.result.length).toBe(2);
    });
  });
});
