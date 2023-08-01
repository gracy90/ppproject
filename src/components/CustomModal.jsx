/* eslint-disable react/prop-types */
import { Modal, Button, DateRangePicker } from "rsuite";
import { styled } from "styled-components";

export default function CustomModal({
  open,
  setOpen,
  size,
  children,
  title,
  onChangeDate,
  isCa,
  setActiveIndex,
}) {
  const handleDataChange = (value) => {
    const from = new Date(value[0]).valueOf();
    const to = new Date(value[1]).valueOf();
    onChangeDate(from, to);
  };

  return (
    <>
      <Modal
        size={size}
        open={open}
        onClose={() => {
          setOpen(false);
          setActiveIndex(undefined);
        }}
      >
        <Modal.Header>
          <ModalHeader>
            <Modal.Title>{title}</Modal.Title>
            {isCa ? (
              <DateRangePicker
                format="yyyy-MM-dd HH:mm:ss"
                defaultCalendarValue={[new Date(), new Date()]}
                onChange={handleDataChange}
              />
            ) : null}
          </ModalHeader>
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

const ModalHeader = styled.div`
  display: flex;
`;
