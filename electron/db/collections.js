exports.BodyValueCollection = {
  name: "body_value",
  schema: {
    version: 0,
    type: "object",
    properties: {
      id: {
        type: "string",
        primary: true,
      },
      name: {
        type: "string",
      },
    },
  },
  required: ["name"],
};

exports.BodyParamCollection = {
  name: "body_param",
  schema: {
    version: 0,
    type: "object",
    properties: {
      id: {
        type: "string",
        primary: true,
      },
      name: {
        type: "string",
      },
      values: {
        type: "array",
        ref: "body_value",
        items: {
          type: "string",
        },
      },
    },
    required: ["name"],
  },
};

exports.EntityCollection = {
  name: "entity",
  schema: {
    version: 0,
    type: "object",
    properties: {
      id: {
        type: "string",
        primary: true,
      },
      name: {
        type: "string",
      },
      replacementPeriod: {
        type: "string",
      },
      bodyParam: {
        ref: "body_param",
        type: "string",
      },
    },
    required: ["name"],
  },
};

exports.PositionCollection = {
  name: "position",
  schema: {
    version: 0,
    type: "object",
    properties: {
      name: {
        type: "string",
        primary: true,
      },
      entities: {
        type: "array",
        ref: "entity",
        items: {
          type: "string",
        },
      },
    },
    required: ["name"],
  },
};

exports.EmployeeCollection = {
  name: "employee",
  schema: {
    version: 0,
    type: "object",
    properties: {
      id: {
        type: "string",
        primary: true,
      },
      name: {
        type: "string",
      },
      positions: {
        type: "array",
        items: {
          ref: "position",
          type: "string",
        },
      },
      bodyParams: {
        type: "array",
        items: {
          type: "object",
          properties: {
            bodyParam: {
              type: "string",
              ref: "body_param",
            },
            bodyValue: {
              type: "string",
              ref: "body_value",
            },
          },
        },
      },
      history: {
        type: "array",
        items: {
          ref: "history",
          type: "string",
        },
      },
    },
    required: ["name"],
  },
};

exports.HistoryCollection = {
  name: "history",
  schema: {
    version: 0,
    type: "object",
    properties: {
      id: {
        type: "string",
        primary: true,
      },
      name: {
        type: "string",
      },
      positions: {
        type: "array",
        items: {
          ref: "position",
          type: "string",
        },
      },
      employee: {
        type: "string",
        ref: "employee",
      },
      entity: {
        type: "string",
        ref: "entity",
      },
      bodyValue: {
        type: "string",
        ref: "body_value",
      },
    },
    required: ["name"],
  },
};

exports.UserCollection = {
  name: "user",
  schema: {
    version: 0,
    properties: {
      id: {
        type: "string",
        primary: true,
      },
      name: {
        type: "string",
      },
      password: {
        type: "string",
      },
      data: {
        type: "object",
        properties: {
          bodyValues: {
            type: "array",
            items: { type: "string", ref: "body_value" },
          },
          bodyParams: {
            type: "array",
            items: { type: "string", ref: "body_param" },
          },
          entities: {
            type: "array",
            items: { type: "string", ref: "entity" },
          },
          positions: {
            type: "array",
            items: { type: "string", ref: "position" },
          },
          employees: {
            type: "array",
            items: { type: "string", ref: "employee" },
          },
          history: {
            type: "array",
            items: { type: "string", ref: "history" },
          },
        },
      },
    },
    required: ["password"],
  },
};
