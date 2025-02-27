import { FormGroup } from '../form';
import { AppButton } from './app-button';

interface ButtonGroupProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

const buttonStyles = {
  width: 'fit-content',
  padding: '8px 20px',
} as const;

export function ButtonGroup({
  onCancel,
  onSubmit,
  submitDisabled,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
}: ButtonGroupProps) {
  return (
    <FormGroup margin="0px">
      <span />
      <FormGroup margin="0px">
        <AppButton
          type="button"
          variant="outlined"
          {...buttonStyles}
          onClick={onCancel}
        >
          {cancelLabel}
        </AppButton>
        <AppButton
          type="button"
          variant="fill"
          {...buttonStyles}
          onClick={onSubmit}
          disabled={submitDisabled}
        >
          {submitLabel}
        </AppButton>
      </FormGroup>
    </FormGroup>
  );
}
