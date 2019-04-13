import React from "react";

import Modal from "@material-ui/core/Modal";

class SimpleModal extends React.Component {
  render() {
    const { children, isOpen, handleClose } = this.props;

    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={isOpen}
          onClose={handleClose}
        >
          <div>{children}</div>
        </Modal>
      </div>
    );
  }
}

export default SimpleModal;
