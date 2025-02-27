import {
  ButtonGroup,
  FormGroup,
  MODAL_TYPES,
  Typography,
} from '@tradein-admin/libs';

type TakeForInventoryProps = {
  setModalStatus: (status: boolean) => void;
  onSubmit: (type: string) => void;
};

export function TakeForInventory({
  setModalStatus,
  onSubmit,
}: TakeForInventoryProps) {
  const handleSubmit = () => {
    onSubmit(MODAL_TYPES.TAKE_FOR_INVENTORY);
    setModalStatus(false);
  };

  const handleCloseModal = () => setModalStatus(false);

  return (
    <>
      <FormGroup marginBottom="20px">
        <Typography variant="body2">
          You are about to take this device for inventory. Do you want to
          proceed?
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
