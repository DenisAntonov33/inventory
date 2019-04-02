import { schema } from "normalizr";

export const bodyValuesSchema = new schema.Entity("bodyValues", {}, {});
export const bodyParamsSchema = new schema.Entity("bodyParams", {}, {});
export const entitiesSchema = new schema.Entity("entities", {}, {});
export const positionsSchema = new schema.Entity("positions", {}, {});
export const employeesSchema = new schema.Entity("employees", {}, {});
export const historySchema = new schema.Entity("history", {}, {});

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
  bodyParams: { bodyParam: bodyParamsSchema, bodyValue: bodyValuesSchema },
});

historySchema.define({
  positions: [positionsSchema],
  employee: employeesSchema,
  entity: entitiesSchema,
  bodyValue: bodyValuesSchema,
});
