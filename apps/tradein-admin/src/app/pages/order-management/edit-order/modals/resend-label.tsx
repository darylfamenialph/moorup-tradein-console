import {
  ButtonGroup,
  FormGroup,
  MODAL_TYPES,
  Typography,
} from '@tradein-admin/libs';

interface ResendLabelProps {
  setModalStatus: (status: boolean) => void;
  onSubmit: (type: string) => void;
}

export function ResendLabel({ setModalStatus, onSubmit }: ResendLabelProps) {
  const handleSubmit = () => {
    onSubmit(MODAL_TYPES.RESEND_LABEL);
    setModalStatus(false);
  };

  const handleCloseModal = () => setModalStatus(false);

  return (
    <>
      <FormGroup marginBottom="20px">
        <Typography variant="body2">
          You are about to resend the label. Do you wish to proceed?
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
