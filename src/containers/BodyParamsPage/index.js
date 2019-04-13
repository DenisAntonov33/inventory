import React, { Component } from "react";
import { connect } from "react-redux";

import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import RemoveButton from "../../components/RemoveButton";
import UpdateButton from "../../components/UpdateButton";
import Modal from "../../components/Modal";

import { actions, selectors } from "../../store/modules/entities";

import Form from "./Form";

const bodyParamsAlias = ["bodyParams"];
const bodyParamsActions = actions[bodyParamsAlias];
const bodyParamsSelectors = selectors[bodyParamsAlias];

class EntityPage extends Component {
  state = {
    isBodyItemModalOpen: false,
    selectedItemId: null,
  };

  componentDidMount() {
    const { readBodyParams, bodyParams } = this.props;
    if (!bodyParams.length) readBodyParams();
  }

  submitHandler = values => {
    const { createBodyParam } = this.props;
    createBodyParam(values);
  };

  openItemModal = item => {
    if (!item) return;

    this.setState({
      isBodyItemModalOpen: true,
      selectedItem: item,
    });
  };

  closeItemModal = () => {
    this.setState({
      isBodyItemModalOpen: false,
      selectedItem: null,
    });
  };

  updateBodyParamHandler = (e, id, args) => {
    e.stopPrepagation();

    console.log(id, args);
  };

  removeBodyParamHandler = (e, id) => {
    e.stopPrepagation();

    const { removeBodyParam } = this.props;
    removeBodyParam(id);
  };

  render() {
    const { isBodyItemModalOpen, selectedItem } = this.state;
    const { bodyParams } = this.props;

    return (
      <div>
        <header>
          <h1>{bodyParamsAlias}</h1>
        </header>

        {selectedItem && (
          <Modal isOpen={isBodyItemModalOpen} onClose={this.closeItemModal}>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedItem.values &&
                    selectedItem.values
                      .filter(e => !e.isDeleted)
                      .map(item => (
                        <TableRow key={item.id}>
                          <TableCell component="th" scope="item">
                            {item.name}
                          </TableCell>
                          <TableCell align="right">
                            {this.removeBodyParamHandler && (
                              <span
                                onClick={e =>
                                  this.removeBodyParamHandler(e, item.id)
                                }
                              >
                                <RemoveButton />
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </Paper>
          </Modal>
        )}

        <Form submitHandler={this.submitHandler} bodyValues={[]} />

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {bodyParams &&
              bodyParams
                .filter(e => !e.isDeleted)
                .map(item => (
                  <TableRow key={item.id}>
                    <TableCell component="th" scope="item">
                      {item.name}
                    </TableCell>
                    <TableCell align="right">
                      {this.updateBodyParamHandler && (
                        <span onClick={() => this.openItemModal(item)}>
                          <UpdateButton />
                        </span>
                      )}
                      {this.removeBodyParamHandler && (
                        <span
                          onClick={e => this.removeBodyParamHandler(e, item.id)}
                        >
                          <RemoveButton />
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = ({ lists, data }) => ({
  bodyParams: bodyParamsSelectors.getItems(lists[bodyParamsAlias], data),
});

const mapDispatchToProps = dispatch => ({
  createBodyParam: args => dispatch(bodyParamsActions.create(args)),
  readBodyParams: () => dispatch(bodyParamsActions.readMany()),
  removeBodyParam: id => dispatch(bodyParamsActions.deleteById(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityPage);
