import React from "react";

import "./index.scss";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";

class SimpleModal extends React.Component {
  render() {
    const { children, isOpen, onClose } = this.props;

    return (
      <Modal
        className="modal"
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
      >
        <Paper className="modal__container">{children}</Paper>
      </Modal>
    );
  }
}

export default SimpleModal;
