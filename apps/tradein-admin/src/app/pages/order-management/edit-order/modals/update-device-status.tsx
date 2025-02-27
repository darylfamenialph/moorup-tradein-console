import {
  AppButton,
  FormGroup,
  MODAL_TYPES,
  StyledInput,
  StyledReactSelect,
  UPDATE_DEVICE_STATUS_OPTIONS,
  UPDATE_PAYMENT_STATUS_POST_ASSESSMENT,
  UPDATE_PAYMENT_STATUS_UPFRONT,
} from '@tradein-admin/libs';
import { isEmpty } from 'lodash';
import { ChangeEvent, useState } from 'react';

interface BaseUpdateStateInterface {
  remarks: string;
}

type UpdateStateInterface =
  | (BaseUpdateStateInterface & { status: string; payment_status?: string })
  | (BaseUpdateStateInterface & { status?: string; payment_status: string });

interface UpdateDeviceStatusProps {
  setModalStatus: (status: boolean) => void;
  onSubmit: (type: string, value: BaseUpdateStateInterface) => void;
  creditType: string;
}

const initialState: UpdateStateInterface = {
  remarks: '',
  status: '',
  payment_status: '',
};

export function UpdateDeviceStatus({
  setModalStatus,
  onSubmit,
  creditType,
}: UpdateDeviceStatusProps) {
  const [updateState, setUpdateState] = useState(initialState);

  const handleSubmit = () => {
    onSubmit(MODAL_TYPES.UPDATE_DEVICE_STATUS, updateState);
    resetState();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdateState({
      ...updateState,
      remarks: e.target.value,
    });
  };

  const resetState = () => {
    setUpdateState(initialState);
  };

  const handleCloseModal = () => {
    resetState();
    setModalStatus(false);
  };

  return (
    <>
      <FormGroup marginBottom="20px">
        <StyledReactSelect
          label="Device Status"
          isMulti={false}
          options={UPDATE_DEVICE_STATUS_OPTIONS}
          name="updateState.status"
          placeholder="Select device status"
          value={updateState.status}
          onChange={(selected) => {
            setUpdateState({
              ...updateState,
              status: selected.value,
            });
          }}
        />
      </FormGroup>
      <FormGroup marginBottom="20px">
        <StyledReactSelect
          label="Device Payment Status"
          isMulti={false}
          options={
            creditType === 'upfront'
              ? UPDATE_PAYMENT_STATUS_UPFRONT
              : UPDATE_PAYMENT_STATUS_POST_ASSESSMENT
          }
          name="updateState.payment_status"
          placeholder="Select device payment status"
          value={updateState.payment_status}
          onChange={(selected) => {
            setUpdateState({
              ...updateState,
              payment_status: selected.value,
            });
          }}
        />
      </FormGroup>
      <FormGroup marginBottom="20px">
        <StyledInput
          label="Update Remarks"
          type="text"
          placeholder="Enter update remarks"
          name="updateState.remarks"
          value={updateState.remarks}
          onChange={handleChange}
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
            disabled={
              (isEmpty(updateState.status) &&
                isEmpty(updateState.payment_status)) ||
              isEmpty(updateState.remarks)
            }
          >
            Submit
          </AppButton>
        </FormGroup>
      </FormGroup>
    </>
  );
}
