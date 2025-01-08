/* eslint-disable react-hooks/exhaustive-deps */
import { faRedo, faWallet } from '@fortawesome/free-solid-svg-icons'; // Added faWallet
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  amountFormatter,
  useAuth,
  usePermission,
  usePreeze,
} from '@tradein-admin/libs';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { AnnouncementModal } from './announcement-modal';

const DashboardContainer = styled.div`
  margin: 24px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled.div`
  position: relative;
  padding: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h4`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TitleIcon = styled(FontAwesomeIcon)`
  font-size: 1.25rem;
  color: #10b981;
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;

  &:hover {
    background: #f3f4f6;
  }

  svg {
    font-size: 1.25rem;
    color: #6b7280;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
`;

const Skeleton = styled.div`
  display: inline-block;
  height: 2rem;
  width: 100px;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200px 100%;
  border-radius: 4px;
  animation: ${shimmer} 1.5s infinite;
`;

const Metric = styled.p`
  margin-top: 0.5rem;
  font-size: 2rem;
  font-weight: 600;
  color: #01463a;
`;

export function DashboardPage() {
  const { hasViewPreezeBalance } = usePermission();
  const { state, getPreezeBalance } = usePreeze();
  const { state: authState } = useAuth();
  const { balance, isFetchingBalance } = state;

  const fetchBalance = useCallback(
    (signal?: any) => {
      getPreezeBalance(signal);
    },
    [getPreezeBalance],
  );

  useEffect(() => {
    if (hasViewPreezeBalance) return;
    const controller = new AbortController();
    const signal = controller.signal;
    fetchBalance(signal);
    return () => {
      controller.abort();
    };
  }, [hasViewPreezeBalance]);

  return (
    <DashboardContainer>
      {hasViewPreezeBalance && (
        <Card>
          <Header>
            <Title>
              <TitleIcon icon={faWallet} /> {/* Added the Wallet icon */}
              Total Preeze Balance
            </Title>
            <RefreshButton onClick={() => fetchBalance()}>
              <FontAwesomeIcon icon={faRedo} />
            </RefreshButton>
          </Header>
          {isFetchingBalance ? (
            <Skeleton />
          ) : (
            <Metric>$ {amountFormatter(balance?.prepaid_balance)}</Metric>
          )}
        </Card>
      )}
      <AnnouncementModal />
    </DashboardContainer>
  );
}
