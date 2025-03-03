import {
  AppButton,
  FormGroup,
  LOCK_TYPES_OPTIONS,
  MODAL_TYPES,
  StyledReactSelect,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { useState } from 'react';

interface SetLockTypeProps {
  setModalStatus: (status: boolean) => void;
  onSubmit: (type: string, value: string) => void;
}

export function SetLockType({ setModalStatus, onSubmit }: SetLockTypeProps) {
  const [lockType, setLockType] = useState<string>('');

  const handleSubmit = () => {
    onSubmit(MODAL_TYPES.SET_LOCK_TYPE, lockType);
    setLockType('');
  };

  const handleCloseModal = () => {
    setLockType('');
    setModalStatus(false);
  };

  return (
    <>
      <FormGroup>
        <StyledReactSelect
          label="Lock Type"
          isMulti={false}
          options={LOCK_TYPES_OPTIONS}
          name="lockType"
          placeholder="Select Lock type"
          value={lockType}
          onChange={(selected) => {
            setLockType(selected.value);
          }}
        />
      </FormGroup>
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
            disabled={isEmpty(lockType)}
          >
            Submit
          </AppButton>
        </FormGroup>
      </FormGroup>
    </>
  );
}
