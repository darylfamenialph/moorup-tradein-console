import {
  ButtonGroup,
  FormGroup,
  MODAL_TYPES,
  Typography,
} from '@tradein-admin/libs';

interface CancelItemProps {
  setModalStatus: (status: boolean) => void;
  onSubmit: (type: string) => void;
}

export function CancelItem({ setModalStatus, onSubmit }: CancelItemProps) {
  const handleSubmit = () => {
    onSubmit(MODAL_TYPES.CANCEL_ITEM);
    setModalStatus(false);
  };

  const handleCloseModal = () => setModalStatus(false);

  return (
    <>
      <FormGroup marginBottom="20px">
        <Typography variant="body2">
          You are about to cancel this item. Do you want to proceed?
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
