import {
  ButtonGroup,
  FormGroup,
  MODAL_TYPES,
  Typography,
} from '@tradein-admin/libs';

interface SetLockTypeConfirmationProps {
  setModalStatus: (status: boolean) => void;
  onSubmit: (type: string) => void;
}

export function SetLockTypeConfirmation({
  setModalStatus,
  onSubmit,
}: SetLockTypeConfirmationProps) {
  const handleSubmit = () => {
    onSubmit(MODAL_TYPES.CONFIRM_SET_LOCK_TYPE);
    setModalStatus(false);
  };

  const handleCloseModal = () => setModalStatus(false);

  return (
    <>
      <FormGroup marginBottom="20px">
        <Typography variant="body2">
          You are about to update the lock type. Do you wish to proceed?
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
