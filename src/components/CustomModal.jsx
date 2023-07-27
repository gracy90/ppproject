/* eslint-disable react/prop-types */
import { Modal, Button } from "rsuite";
import { styled } from "styled-components";

export default function CustomModal({ open, setOpen, size, children, title }) {
  return (
    <>
      <Modal size={size} open={open} onClose={() => setOpen(false)}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ModalBody>{children}</ModalBody>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpen(false)} appearance="subtle">
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)} appearance="primary">
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const ModalBody = styled.div`
  width: 100%;
  height: 100%;
`;
