import {
  ButtonGroup,
  FormGroup,
  MODAL_TYPES,
  Typography,
} from '@tradein-admin/libs';

interface MarkAsReceivedProps {
  setModalStatus: (status: boolean) => void;
  onSubmit: (type: string) => void;
}

export function MarkAsReceived({
  setModalStatus,
  onSubmit,
}: MarkAsReceivedProps) {
  const handleSubmit = () => {
    onSubmit(MODAL_TYPES.MARK_AS_RECEIVED);
    setModalStatus(false);
  };

  const handleCloseModal = () => setModalStatus(false);

  return (
    <>
      <FormGroup marginBottom="20px">
        <Typography variant="body2">
          You are about to confirm receipt of this device. Do you want to
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
