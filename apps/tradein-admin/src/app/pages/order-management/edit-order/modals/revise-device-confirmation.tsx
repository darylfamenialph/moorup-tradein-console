import {
  ButtonGroup,
  FormGroup,
  MODAL_TYPES,
  Typography,
} from '@tradein-admin/libs';

interface ReviseDeviceConfirmationProps {
  setModalStatus: (status: boolean) => void;
  onSubmit: (type: string) => void;
}

export function ReviseDeviceConfirmation({
  setModalStatus,
  onSubmit,
}: ReviseDeviceConfirmationProps) {
  const handleSubmit = () => {
    onSubmit(MODAL_TYPES.CONFIRM_REVISE_DEVICE);
    setModalStatus(false);
  };

  const handleCloseModal = () => setModalStatus(false);

  return (
    <>
      <FormGroup marginBottom="20px">
        <Typography variant="body2">
          This device is about to be revised. Do you wish to proceed?
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
