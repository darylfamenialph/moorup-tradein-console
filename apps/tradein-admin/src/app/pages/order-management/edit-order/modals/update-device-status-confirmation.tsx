import {
  ButtonGroup,
  FormGroup,
  MODAL_TYPES,
  Typography,
} from '@tradein-admin/libs';

interface UpdateDeviceStatusConfirmationProps {
  setModalStatus: (status: boolean) => void;
  onSubmit: (type: string) => void;
}

export function UpdateDeviceStatusConfirmation({
  setModalStatus,
  onSubmit,
}: UpdateDeviceStatusConfirmationProps) {
  const handleSubmit = () => {
    onSubmit(MODAL_TYPES.CONFIRM_UPDATE_DEVICE_STATUS);
    setModalStatus(false);
  };

  const handleCloseModal = () => setModalStatus(false);

  return (
    <>
      <FormGroup marginBottom="20px">
        <Typography variant="body2">
          You are about to change the device status. Do you wish to proceed?
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
