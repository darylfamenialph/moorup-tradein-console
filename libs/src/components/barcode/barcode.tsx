import { useRef } from 'react';
import Barcode from 'react-barcode';
import { useReactToPrint } from 'react-to-print';
import styled from 'styled-components';
import { AppButton } from '../button';
import { Typography } from '../typography';

const PrintContainer = styled.div`
  padding: 10px;
  border: 1px solid #000;
  margin: 0 auto;
  width: fit-content;
`;

const BarcodeWrapper = styled.div`
  margin-bottom: 0px;
  text-align: center;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LockType = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 8px;
`;


const SellGrade = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  gap: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  td {
    border: 1px solid black;
    padding: 4px;
  }
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
  max-width: 700px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

interface BarcodeLabelPrintPreviewProps {
  deviceId: string;
  showPreview: boolean;
  onClose: () => void;
}

export function BarcodeLabelPrintPreview({ deviceId, showPreview, onClose }: BarcodeLabelPrintPreviewProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'Print Document',
    onAfterPrint: () => console.log('Print successful!'),
    pageStyle: `
      @page {
        margin: 0;  /* Remove default page margins */
      }
      body {
        margin: 0;
        padding: 0;
        width: 100%;
      }
    `,
  });

  if (!showPreview) {
    return null;
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <PrintContainer ref={componentRef}>
          <BarcodeWrapper>
            <Barcode value={deviceId} height={30} width={2} displayValue={false} />
          </BarcodeWrapper>

          <ContentContainer>
            <LockType>
              <Typography variant='body1' fontWeight={600}>{deviceId}</Typography>
              <b>Lock Type:</b>
              <div>ACTIVATION (REC)</div>
              <div>MDM (REC)</div>
              <div>NETWORK LOCK</div>
            </LockType>

            <SellGrade>
              <b>Sell Grade</b>
              <Table>
                <tbody>
                  <tr>
                    <td>EXCELLENT</td>
                    <td>DAMAGED</td>
                  </tr>
                  <tr>
                    <td>GOOD</td>
                    <td>LCD DAMAGED</td>
                  </tr>
                  <tr>
                    <td>FAIR</td>
                    <td>BER</td>
                  </tr>
                  <tr>
                    <td>POOR</td>
                    <td></td>
                  </tr>
                </tbody>
              </Table>
            </SellGrade>
          </ContentContainer>
        </PrintContainer>

        <div style={{ marginTop: '20px', textAlign: 'right', gap: '10px', display: 'flex' }}>
          <AppButton onClick={onClose} variant='outlined'>
            Close
          </AppButton>
          <AppButton onClick={handlePrint}>Print</AppButton>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
}
