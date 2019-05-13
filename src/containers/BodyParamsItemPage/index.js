import React, { Component } from "react";
import { connect } from "react-redux";
import MaterialTable from "material-table";

import { FormattedMessage } from "react-intl";
import commonMessages from "../../common/messages";
import messages from "./messages";

import { actions, selectors } from "../../store/modules/entities";

const bodyParamsAlias = ["bodyParams"];
const bodyParamsActions = actions[bodyParamsAlias];
const bodyParamsSelectors = selectors[bodyParamsAlias];

const bodyValuesAlias = ["bodyValues"];
const bodyValuesActions = actions[bodyValuesAlias];

class EntityPage extends Component {
  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      readBodyParam,
    } = this.props;

    readBodyParam(id);
  }

  render() {
    const {
      data,
      match: {
        params: { id },
      },
      updateBodyParam,
      updateBodyValue,
    } = this.props;

    const bodyParam = bodyParamsSelectors.getItemById(id, data);

    const filteredBodyValues = bodyParam
      ? bodyParam.values.filter(e => !e.isDeleted)
      : [];

    return (
      <div>
        <header className="page__header">
          <h1>
            <FormattedMessage {...messages.pageTitle} />
            {id}
          </h1>
        </header>

        <MaterialTable
          title="Editable Example"
          columns={[
            {
              title: <FormattedMessage {...commonMessages.name} />,
              field: "name",
            },
          ]}
          data={filteredBodyValues}
          editable={{
            onRowAdd: newData =>
              new Promise(resolve => {
                console.log(newData);
                updateBodyParam(id, { $create: { values: newData } });
                resolve();
              }),

            onRowUpdate: (newData, oldData) =>
              new Promise(resolve => {
                const args = Object.keys(newData).reduce((acc, curr) => {
                  if (newData[curr] !== oldData[curr])
                    acc[curr] = newData[curr];
                  return acc;
                }, {});

                updateBodyValue(oldData.id, { $set: args });
                resolve();
              }),

            onRowDelete: oldData =>
              new Promise(resolve => {
                updateBodyParam(id, {
                  $pull: { values: { id: oldData.id } },
                });
                resolve();
              }),
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ data }) => ({
  data,
});

const mapDispatchToProps = dispatch => ({
  readBodyParam: id => dispatch(bodyParamsActions.readById(id)),
  updateBodyParam: (id, args) =>
    dispatch(bodyParamsActions.updateById(id, args)),
  updateBodyValue: (id, args) =>
    dispatch(bodyValuesActions.updateById(id, args)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityPage);
