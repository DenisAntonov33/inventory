import React from "react";

import "./index.scss";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

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
        <Paper className="modal__container">
          <div className="modal__header">
            <Button onClick={onClose}>Close</Button>
          </div>
          <div className="modal__content">{children}</div>
        </Paper>
      </Modal>
    );
  }
}

export default SimpleModal;
