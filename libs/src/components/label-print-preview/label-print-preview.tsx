/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from 'react';
import QRCode from 'react-qr-code';
import { useReactToPrint } from 'react-to-print';
import styled from 'styled-components';
import { CREDIT_TYPES, PLATFORMS } from '../../constants';
import { formatDate } from '../../helpers';
import { AppButton } from '../button';
import { FormGroup } from '../form';

const PrintContainer = styled.div`
  width: 30mm;
  height: 62mm;
  padding: 2mm;
  border: 1px solid #000;
  margin: 0 auto;
  box-sizing: border-box;
  display: none;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  gap: 4px;

  @media print {
    display: flex;
  }
`;

const PreviewContainer = styled.div`
  width: 30mm;
  height: 62mm;
  padding: 2mm;
  border: 1px solid #000;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  gap: 4px;
  transform: rotate(90deg);
`;

const TextWrapper = styled.div`
  font-size: 12px;
  text-align: left;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
`;

const RotatedTextWrapper = styled.div`
  font-size: 12px;
  text-align: left;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
`;

const QRWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 4px;
  align-items: flex-end;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  max-width: 400px;
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
    size: 30mm 62mm;
    margin: 0;
    transform: rotate(-90deg);
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
        <PrintContainer ref={componentRef}>
          <RotatedTextWrapper>
            <b>{orderItem?.line_item_number}</b>
          </RotatedTextWrapper>
          <ContentWrapper>
            <TextWrapper>
              <div>{PLATFORMS[order?.platform]}</div>
              <div>{CREDIT_TYPES[order?.credit_type]}</div>
              <br />
              <div>Received</div>
              <div>{formatDate(orderItem?.updatedAt)}</div>
            </TextWrapper>

            <QRWrapper>
              <QRCode
                size={100}
                style={{ height: 'auto', width: '100%', maxWidth: '24mm' }}
                value={orderItem?.line_item_number}
                viewBox="0 0 100 100"
              />
            </QRWrapper>
          </ContentWrapper>
        </PrintContainer>

        <PreviewContainer>
          <RotatedTextWrapper>
            <b>{orderItem?.line_item_number}</b>
          </RotatedTextWrapper>
          <ContentWrapper>
            <TextWrapper>
              <div>{PLATFORMS[order?.platform]}</div>
              <div>{CREDIT_TYPES[order?.credit_type]}</div>
              <br />
              <div>Received</div>
              <div>{formatDate(orderItem?.updatedAt)}</div>
            </TextWrapper>

            <QRWrapper>
              <QRCode
                size={100}
                style={{ height: 'auto', width: '100%', maxWidth: '24mm' }}
                value={orderItem?.line_item_number}
                viewBox="0 0 100 100"
              />
            </QRWrapper>
          </ContentWrapper>
        </PreviewContainer>

        <FormGroup margin="0px">
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
