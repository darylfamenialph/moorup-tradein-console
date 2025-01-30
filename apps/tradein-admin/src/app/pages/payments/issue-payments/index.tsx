/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppButton, FormGroup, Typography } from '@tradein-admin/libs';
import { isEmpty } from 'lodash';

interface IssuePaymentModalProps {
  closeModal: () => void;
  selectedRows: any;
  paymentValues: {
    currentPrezzeeBalance: number;
    totalDevicesSelected: number;
    totalValueSelected: number;
  };
  platformConfig: {
    giftCardGateway: string;
  };
  onConfirm: () => void;
}

export function IssuePayment({
  closeModal,
  paymentValues: {
    currentPrezzeeBalance,
    totalDevicesSelected,
    totalValueSelected,
  },
  selectedRows,
  platformConfig: { giftCardGateway },
  onConfirm,
}: IssuePaymentModalProps) {
  return giftCardGateway === 'prezzee' &&
    currentPrezzeeBalance < totalValueSelected ? (
    <div style={{ width: '100%' }}>
      <Typography variant="body2">
        The current selection of {totalDevicesSelected} device
        {totalDevicesSelected > 1 ? 's' : ''} at ${totalValueSelected} exceeds
        the current Prezzee Balance of ${currentPrezzeeBalance}.
      </Typography>

      <Typography variant="body2" fontWeight={600} marginBottom="20px">
        Please adjust the selection to proceed.
      </Typography>

      <FormGroup>
        <span />
        <AppButton variant="fill" width="100%" onClick={closeModal}>
          Okay
        </AppButton>
      </FormGroup>
    </div>
  ) : (
    <div style={{ width: '100%' }}>
      <Typography variant="body2">
        Please review the details carefully before proceeding.
      </Typography>
      <Typography variant="body2" fontWeight={600} marginBottom="20px">
        Total Amount: {totalValueSelected}
      </Typography>

      <FormGroup>
        <AppButton variant="outlined" width="100%" onClick={closeModal}>
          Cancel
        </AppButton>
        <AppButton
          width="100%"
          onClick={onConfirm}
          disabled={isEmpty(selectedRows)}
        >
          Confirm
        </AppButton>
      </FormGroup>
    </div>
  );
}
