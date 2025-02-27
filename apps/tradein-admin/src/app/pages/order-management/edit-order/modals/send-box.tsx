import {
  ButtonGroup,
  FormGroup,
  MODAL_TYPES,
  Typography,
} from '@tradein-admin/libs';

interface SendBoxProps {
  setModalStatus: (status: boolean) => void;
  onSubmit: (type: string) => void;
}

export function SendBox({ setModalStatus, onSubmit }: SendBoxProps) {
  const handleSubmit = () => {
    onSubmit(MODAL_TYPES.SEND_BOX);
    setModalStatus(false);
  };

  const handleCloseModal = () => setModalStatus(false);

  return (
    <>
      <FormGroup marginBottom="20px">
        <Typography variant="body2">
          You are about to send this box. Do you wish to proceed?
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
