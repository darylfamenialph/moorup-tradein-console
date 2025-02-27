import {
  ButtonGroup,
  FormGroup,
  MODAL_TYPES,
  Typography,
} from '@tradein-admin/libs';

interface EvaluateDeviceProps {
  setModalStatus: (status: boolean) => void;
  onSubmit: (type: string) => void;
}

export function EvaluateDevice({
  setModalStatus,
  onSubmit,
}: EvaluateDeviceProps) {
  const handleSubmit = () => {
    onSubmit(MODAL_TYPES.EVALUATE_DEVICE);
    setModalStatus(false);
  };

  const handleCloseModal = () => setModalStatus(false);

  return (
    <>
      <FormGroup marginBottom="20px">
        <Typography variant="body2">
          This action will finalize the device evaluation. Do you want to
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
