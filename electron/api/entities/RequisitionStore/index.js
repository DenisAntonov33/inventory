const { Entity } = require("../_Entity_");
const { Store } = require("../Store");
const { Requisition } = require("../Requisition");

const { StoreCollection } = require("../../../db/collections");

const store = new Store(StoreCollection);
const requisition = new Requisition();

class RequisitionStore extends Entity {
  constructor(collection) {
    super(collection);
    this.defaultMethods = ["create"];
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
      const storeList = await store._readMany();
      const requisitionList = await requisition._create(args);

      const data = requisitionList.reduce((acc, curr) => {
        const key = `${curr.entity}${curr.bodyValue}`;

        if (acc[key] === undefined)
          acc[key] = {
            entity: curr.entity,
            bodyValue: curr.bodyValue,
            count: 0,
          };

        acc[key]["count"] += curr.count;

        return acc;
      }, {});

      return Object.keys(data).map(e => {
        const item = data[e];

        const storeItem = storeList.find(
          e => e.entity.id === item.entity && e.bodyValue.id === item.bodyValue
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
