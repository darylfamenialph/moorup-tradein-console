import { Button, CenterModal, Typography, useOrder } from '@tradein-admin/libs';
import React, { ReactNode, useEffect } from 'react';

interface IssuePaymentModalProps {
  isOpen: boolean;
  closeModal: () => void;
  width?: string;
  selectedRows: any;
  paymentValues: {
    currentPrezzeeBalance: number;
    totalDevicesSelected: number;
    totalValueSelected: number;
  };
  platformConfig: {
    giftCardGateway: string;
  };
  setSelectedRows: (rows: any[]) => void;
}

const TextDetail = ({ children }: { children: ReactNode }) => (
  <p className="text-md font-bold text-center">{children}</p>
);

const IssuePaymentModal = ({
  isOpen,
  closeModal,
  width,
  paymentValues: {
    currentPrezzeeBalance,
    totalDevicesSelected,
    totalValueSelected,
  },
  selectedRows,
  platformConfig: { giftCardGateway },
  setSelectedRows,
}: IssuePaymentModalProps) => {
  const { requestGiftCardPayment } = useOrder();
  const isGiftCardProviderPrezzee = giftCardGateway === 'prezzee';

  const deviceIds = selectedRows.map((row: { deviceId: any }) => row.deviceId);

  const ModalContent = () => (
    <div className="flex flex-col items-center">
      {isGiftCardProviderPrezzee &&
      currentPrezzeeBalance < totalValueSelected ? (
        <TextDetail>
          The current selection of {totalDevicesSelected} device
          {totalDevicesSelected > 1 ? 's' : ''} at ${totalValueSelected} exceeds
          the current Prezzee Balance of ${currentPrezzeeBalance}. <br /> Please
          adjust the selection to proceed.
        </TextDetail>
      ) : (
        <>
          <TextDetail>
            Do you wish to submit the {totalDevicesSelected} device
            {totalDevicesSelected > 1 ? 's' : ''} for payment?
          </TextDetail>
          <TextDetail>Payment value: ${totalValueSelected}</TextDetail>
        </>
      )}
    </div>
  );

  const ActionButtons = () => {
    const handleConfirm = () => {
      requestGiftCardPayment(deviceIds);
      setSelectedRows([]);
      closeModal();
    };

    if (
      isGiftCardProviderPrezzee &&
      currentPrezzeeBalance < totalValueSelected
    ) {
      return (
        <Button btnType="default" size="small" onClick={closeModal}>
          Okay
        </Button>
      );
    }

    return (
      <>
        <Button btnType="dark" size="small" onClick={handleConfirm}>
          Confirm
        </Button>
        <Button btnType="default" size="small" onClick={closeModal}>
          Cancel
        </Button>
      </>
    );
  };

  return (
    <CenterModal isOpen={isOpen} onClose={closeModal} width={width}>
      <div className="flex items-center justify-center m-20 flex-col gap-5">
        <ModalContent />
        <div className="flex gap-10">
          <ActionButtons />
        </div>
      </div>
    </CenterModal>
  );
};

export default IssuePaymentModal;
