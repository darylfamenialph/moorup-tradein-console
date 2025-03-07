/* eslint-disable react-hooks/exhaustive-deps */
import { faRedo, faWallet } from '@fortawesome/free-solid-svg-icons'; // Added faWallet
import {
  amountFormatter,
  ANNOUNCEMENT_MODAL,
  AnnouncementModal,
  CardContainer,
  defaultTheme,
  FormGroup,
  Grid,
  GridItem,
  IconButton,
  PREZZEE_SUPPORTED_PLATFORMS,
  Skeleton,
  StyledIcon,
  Typography,
  useAuth,
  usePermission,
  usePrezzee,
} from '@tradein-admin/libs';
import { useEffect, useState } from 'react';

export function DashboardPage() {
  const { hasViewPreezeBalance } = usePermission();
  const { state: prezzeeState, updatePrezzeeBalance } = usePrezzee();
  const { isFetchingBalance } = prezzeeState;
  const { state: authState } = useAuth();
  const { platformConfig, isFetchingPlatformConfig } = authState;
  const omcAnnouncementPopup = platformConfig?.omcAnnouncementPopup ?? {};
  const [openAnnouncementModal, setOpenAnnouncementModal] = useState(false);
  const [balance, setBalance] = useState(
    platformConfig?.gc_balance_details?.current_balance || 0,
  );

  useEffect(() => {
    const hasClosedModal =
      sessionStorage.getItem(ANNOUNCEMENT_MODAL) === 'false';
    if (omcAnnouncementPopup?.enabled && !hasClosedModal) {
      setOpenAnnouncementModal(true);
      sessionStorage.setItem(ANNOUNCEMENT_MODAL, 'true');
    }
  }, [omcAnnouncementPopup]);

  useEffect(() => {
    const current_balance =
      platformConfig?.gc_balance_details?.current_balance ?? 0;
    setBalance(current_balance);
  }, [platformConfig]);

  return (
    <Grid columns="2" gap="0px">
      {PREZZEE_SUPPORTED_PLATFORMS.includes(platformConfig?.platform) &&
        hasViewPreezeBalance && (
          <GridItem>
            <CardContainer
              backgroundColor="white"
              padding="1.5rem"
              height="max-content"
              overflow="hidden"
            >
              <FormGroup>
                <FormGroup alignItems="center">
                  <StyledIcon icon={faWallet} color="#10b981" />
                  <Typography
                    fontSize="0.875rem"
                    fontWeight={500}
                    color={defaultTheme.default.text}
                  >
                    Total Prezzee Balance
                  </Typography>
                </FormGroup>
                <IconButton
                  size="lg"
                  hovercolor="#6b7280"
                  tooltipLabel="Refresh Balance"
                  icon={faRedo}
                  onClick={() => updatePrezzeeBalance()}
                />
              </FormGroup>
              {isFetchingBalance || isFetchingPlatformConfig ? (
                <Skeleton />
              ) : (
                <Typography
                  variant="h4"
                  fontWeight={600}
                  color={defaultTheme.primary.text}
                >
                  $ {amountFormatter(balance)}
                </Typography>
              )}
            </CardContainer>
          </GridItem>
        )}
      <AnnouncementModal
        isOpen={openAnnouncementModal}
        onClose={() => {
          setOpenAnnouncementModal(false);
          sessionStorage.setItem(ANNOUNCEMENT_MODAL, 'false');
        }}
        headerText={omcAnnouncementPopup?.headerText}
        context={omcAnnouncementPopup?.context || ''}
        url={omcAnnouncementPopup?.url}
      />
    </Grid>
  );
}
