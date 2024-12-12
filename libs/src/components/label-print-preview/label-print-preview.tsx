/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from 'react';
import QRCode from 'react-qr-code';
import { useReactToPrint } from 'react-to-print';
import styled from 'styled-components';
import { CREDIT_TYPES, PLATFORMS } from '../../constants';
import { formatDate } from '../../helpers';
import { AppButton } from '../button';
import { FormGroup } from '../form';
import { Typography } from '../typography';

const PreviewContainer = styled.div`
  width: 115mm;
  height: 62mm;
  padding: 5mm;
  border: 1px solid #000;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const QRWrapper = styled.div`
  display: flex;
  gap: 4px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h2`
  margin-top: 0;
  color: #01463A;
  font-size: 20px;
  margin-bottom: 20px;
`;

const pageStyle = `
  @page {
    size: 115mm 62mm;
    margin: 0;
  }
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

export function LabelPrintPreview({ order, orderItem, showPreview, onClose }: LabelPrintPreviewProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'Print Document',
    pageStyle
  });

  if (!showPreview) {
    return null;
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>
          Print Device Label
        </ModalTitle>

        <PreviewContainer ref={componentRef}>
          <Typography variant='subtitle1' fontWeight={600}>
            {orderItem?.line_item_number}
          </Typography>
          <ContentWrapper>
            <QRWrapper>
              <QRCode
                size={154}
                style={{ height: 'auto', width: '100%' }}
                value={orderItem?.line_item_number}
                viewBox="0 0 154 154"
              />
            </QRWrapper>
            <TextWrapper>
              <Typography variant='subtitle2'>{PLATFORMS[order?.platform]}</Typography>
              <Typography variant='subtitle2'>{CREDIT_TYPES[order?.credit_type]}</Typography>
              <br />
              <Typography variant='subtitle2'>Received</Typography>
              <Typography variant='subtitle2'>{formatDate(orderItem?.updatedAt)}</Typography>
            </TextWrapper>
          </ContentWrapper>
        </PreviewContainer>

        <FormGroup marginTop="20px">
          <span />
          <FormGroup margin="0px">
            <AppButton
              type="button"
              variant="outlined"
              width="fit-content"
              padding="8px 20px"
              onClick={onClose}
            >
              Close
            </AppButton>
            <AppButton
              type="button"
              variant="fill"
              width="fit-content"
              padding="8px 20px"
              onClick={handlePrint}
            >
              Print
            </AppButton>
          </FormGroup>
        </FormGroup>
      </ModalContent>
    </ModalOverlay>
  );
}

interface LabelPrintPreviewProps {
  order: any;
  orderItem: any;
  showPreview: boolean;
  onClose: () => void;
}
