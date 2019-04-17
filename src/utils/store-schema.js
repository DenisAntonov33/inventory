import { schema } from "normalizr";

const bodyValuesSchema = new schema.Entity("bodyValues", {}, {});
const bodyParamsSchema = new schema.Entity("bodyParams", {});
const entitiesSchema = new schema.Entity("entities", {}, {});
const positionsSchema = new schema.Entity("positions", {}, {});
const employeesSchema = new schema.Entity("employees", {}, {});
const historySchema = new schema.Entity("history", {}, {});

bodyValuesSchema.define({});

bodyParamsSchema.define({
  values: [bodyValuesSchema],
});

entitiesSchema.define({
  bodyParam: bodyParamsSchema,
});

positionsSchema.define({
  entities: [entitiesSchema],
});

employeesSchema.define({
  positions: [positionsSchema],
  history: [historySchema],
  bodyParams: [{ bodyParam: bodyParamsSchema, bodyValue: bodyValuesSchema }],
});

historySchema.define({
  positions: [positionsSchema],
  employee: employeesSchema,
  entity: entitiesSchema,
  bodyValue: bodyValuesSchema,
});

export default {
  bodyValues: bodyValuesSchema,
  bodyParams: bodyParamsSchema,
  entities: entitiesSchema,
  positions: positionsSchema,
  employees: employeesSchema,
  history: historySchema,
};
