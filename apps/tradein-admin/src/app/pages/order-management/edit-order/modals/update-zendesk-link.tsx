import {
  AppButton,
  FormGroup,
  MODAL_TYPES,
  StyledInput,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { SetStateAction, useState } from 'react';

type FormProps = {
  currentZendeskLink?: string;
  setModalStatus: (status: boolean) => void;
  onSubmit: (type: string, value: string) => void;
};

export function UpdateZendeskLink({
  currentZendeskLink = '',
  setModalStatus,
  onSubmit,
}: FormProps) {
  const [zendeskLink, setZendeskLink] = useState<string>(currentZendeskLink);
  const [zendeskLinkInputErrorMessage, setZendeskLinkInputErrorMessage] =
    useState('');
  const [zendeskLinkInputError, setZendeskLinkInputError] = useState(false);

  const handleSubmit = () => {
    onSubmit(MODAL_TYPES.UPDATE_ZENDESK_LINK, zendeskLink);
    setModalStatus(false);
  };

  const handleChange = (e: { target: { value: SetStateAction<string> } }) => {
    setZendeskLink(e.target.value);
    setZendeskLinkInputError(false);
    setZendeskLinkInputErrorMessage('');
  };

  const handleBlur = () => {
    if (!zendeskLink.trim()) {
      setZendeskLinkInputError(true);
      setZendeskLinkInputErrorMessage('This field is required.');
    } else {
      setZendeskLinkInputError(false);
      setZendeskLinkInputErrorMessage('');
    }
  };

  const handleCloseModal = () => {
    setZendeskLink('');
    setZendeskLinkInputError(false);
    setZendeskLinkInputErrorMessage('');

    setModalStatus(false);
  };

  return (
    <>
      <StyledInput
        type="text"
        id="zendesk_link"
        label="Zendesk Link"
        name="zendesk_link"
        placeholder="Zendesk Link"
        onChange={(e) => handleChange(e)}
        value={zendeskLink}
        onBlur={handleBlur}
        error={zendeskLinkInputError}
        errorMessage={zendeskLinkInputErrorMessage}
      />
      <FormGroup margin="0px">
        <span />
        <FormGroup margin="0px">
          <AppButton
            type="button"
            variant="outlined"
            width="fit-content"
            padding="8px 20px"
            onClick={handleCloseModal}
          >
            Cancel
          </AppButton>
          <AppButton
            type="button"
            variant="fill"
            width="fit-content"
            padding="8px 20px"
            onClick={handleSubmit}
            disabled={isEmpty(zendeskLink)}
          >
            Submit
          </AppButton>
        </FormGroup>
      </FormGroup>
    </>
  );
}
