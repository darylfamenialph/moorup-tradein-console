import {
  ButtonGroup,
  FormGroup,
  MODAL_TYPES,
  Typography,
} from '@tradein-admin/libs';

interface ReturnDeviceProps {
  setModalStatus: (status: boolean) => void;
  onSubmit: (type: string) => void;
}

export function ReturnDevice({ setModalStatus, onSubmit }: ReturnDeviceProps) {
  const handleSubmit = () => {
    onSubmit(MODAL_TYPES.RETURN_DEVICE);
    setModalStatus(false);
  };

  const handleCloseModal = () => setModalStatus(false);

  return (
    <>
      <FormGroup marginBottom="20px">
        <Typography variant="body2">
          Proceeding will mark this device as returned. Do you want to proceed?
        </Typography>
      </FormGroup>
      <ButtonGroup
        onCancel={handleCloseModal}
        onSubmit={handleSubmit}
        submitDisabled={false}
      />
    </>
  );
}
