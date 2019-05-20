const { Factory } = require("./_Factory_");

class RequisitionStore extends Factory {
  constructor(args) {
    super(args);

    this.defaultMethods = ["create"];

    const {
      items: { store, requisition },
    } = args;

    if (!store) throw new Error("store instance required");
    if (!requisition) throw new Error("requisition instance required");

    this.store = store;
    this.requisition = requisition;
  }

  async create(event, _args) {
    try {
      const { token } = _args;
      const user = await this._authentification(token);
      const expandedUser = user.toJSON();
      const args = {
        availableEmployees: expandedUser.data["employees"],
      };
      const items = await this._create(args);
      event.returnValue = this.res.success({ items });
      return event;
    } catch (err) {
      event.returnValue = this.res.error(500, err.message);
      return event;
    }
  }

  async _create(args) {
    try {
      const storeList = await this.store._readMany();
      const requisitionList = await this.requisition._create(args);

      const data = requisitionList.reduce((acc, curr) => {
        const key = curr.bodyValue
          ? `${curr.entity}${curr.bodyValue}`
          : `${curr.entity}`;

        if (acc[key] === undefined)
          acc[key] = {
            entity: curr.entity,
            ...(curr.bodyValue ? { bodyValue: curr.bodyValue } : {}),
            count: 0,
          };

        acc[key]["count"] += curr.count;

        return acc;
      }, {});

      return Object.keys(data).map(e => {
        const item = data[e];

        const storeItem = storeList.find(
          e =>
            e.entity.id === item.entity &&
            (e.bodyValue ? e.bodyValue.id === item.bodyValue : true)
        );

        if (!storeItem) return item;

        const diff = item.count - storeItem.count;
        item.count = diff < 0 ? 0 : diff;

        return item;
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

exports.RequisitionStore = RequisitionStore;
