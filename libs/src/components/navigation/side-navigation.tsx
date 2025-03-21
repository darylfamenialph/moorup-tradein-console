/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  faAngleDown,
  faAngleRight,
  faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import {
  Menu,
  MenuItem,
  MenuItemStyles,
  Sidebar,
  SubMenu,
} from 'react-pro-sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../../Moorup.png';
import { SIDENAV_ITEMS, SIDENAV_ITEMS_SETTINGS } from '../../constants';
import { getMenuIdByPathname, hexToRgba } from '../../helpers';
import { usePermission } from '../../hooks';
import { useAuth, useCommon } from '../../store';
import { Typography } from '../typography';
import { withChild } from '../with-child';

const Image = styled.img`
  height: 4rem;
  width: 100%;
  display: block;
  object-fit: cover;
  -webkit-align-self: center;
  -ms-flex-item-align: center;
  align-self: center;
  padding: 0px 60px;
`;

const StyledIcon = styled(FontAwesomeIcon)<{ size?: string }>`
  ${(props) => props.size && `font-size: ${props.size};`}
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  z-index: 999;
`;

const WCContainer = withChild(Container);
const WCSidebar = withChild(Sidebar);
const WCMenu = withChild(Menu);
const WCSubMenu = withChild(SubMenu);
const WCMenuItem = withChild(MenuItem);

export function SideBar(): JSX.Element {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { logoutUser } = useAuth();
  const { state: commonState, setShowSideNav } = useCommon();
  const { showSideNav } = commonState;

  const [activeId, setActiveId] = useState<number>(0);

  const {
    hasViewDashboardPermission,
    hasViewProductsPermission,
    hasViewOrdersPermission,
    hasViewDiscrepanciesPermission,
    hasViewPromotionsPermission,
    hasViewPromotionClaimsPermission,
    hasViewPromotionClaimsPaymentPermission,
    hasViewUsersPermission,
    hasViewPlatformConfigsPermissions,
    hasViewPaymentsPermission,
    hasViewActionablesFollowUpDeviceNotSentPermission,
    hasViewActionablesFollowUpRecycleOfferPermission,
    hasViewActionablesFollowUpRevisionOfferPermission,
    hasViewActionablesForRecyclePermission,
    hasViewActionablesForReturnPermission,
    hasViewActionablesLockedDevicesCurrentLockPermission,
    hasViewActionablesLockedDevicesForRetestPermission,
    hasViewActionablesPaymentActionNeededPermission,
    hasViewActionablesDevicesWithBoxPermission,
    hasViewActionablesDevicesTakenForInventoryPermission,
  } = usePermission();

  const filteredSideNavItems = SIDENAV_ITEMS.filter((item) => {
    switch (item.title) {
      case 'Home':
        return hasViewDashboardPermission;

      case 'Product Management':
        return hasViewProductsPermission;

      case 'Order Management':
        return (
          hasViewOrdersPermission ||
          hasViewDiscrepanciesPermission ||
          hasViewPaymentsPermission
        );

      case 'Actionables':
        return (
          hasViewActionablesFollowUpDeviceNotSentPermission ||
          hasViewActionablesFollowUpRecycleOfferPermission ||
          hasViewActionablesFollowUpRevisionOfferPermission ||
          hasViewActionablesForRecyclePermission ||
          hasViewActionablesForReturnPermission ||
          hasViewActionablesLockedDevicesCurrentLockPermission ||
          hasViewActionablesLockedDevicesForRetestPermission ||
          hasViewActionablesDevicesTakenForInventoryPermission
        );

      case 'Promotion Management':
        return (
          hasViewPromotionsPermission ||
          hasViewPromotionClaimsPermission ||
          hasViewPromotionClaimsPaymentPermission
        );

      case 'User Management':
        return hasViewUsersPermission;

      default:
        return false;
    }
  });

  const filteredSideNavSettingsItems = SIDENAV_ITEMS_SETTINGS.filter((item) => {
    switch (item.title) {
      case 'Configurations':
        return hasViewPlatformConfigsPermissions;

      case 'Templates':
        return hasViewPlatformConfigsPermissions;

      default:
        return false;
    }
  });

  const menuItemStyles: MenuItemStyles = {
    root: {
      fontSize: '13.333px',
      fontWeight: 600,
    },
    icon: {
      '&.disabled': {
        color: '#ccc',
      },
      '&:hover': {
        color: 'white',
      },
      '&.ps-active': {
        color: 'white',
      },
    },
    SubMenuExpandIcon: {
      color: '#b6b7b9',
    },
    subMenuContent: ({ level }) => ({
      backgroundColor: level === 0 ? hexToRgba('#fbfcfd', 1) : 'transparent',
    }),
    button: {
      '&:hover': {
        background: 'linear-gradient(to right, #216A4C, #216A4C)',
        color: 'white',

        '& svg': {
          color: 'white',
        },
      },
      '&.ps-active': {
        background: 'linear-gradient(to right, #01463A, #01463A)',
        color: 'white',

        '& svg': {
          color: 'white',
        },
      },
    },
  };

  const handleOnChangeActiveId = (id: number) => {
    setActiveId(id === activeId ? 0 : id);
  }

useEffect(() => {
  setActiveId(pathname ? getMenuIdByPathname(pathname) : 0);
  return () => setActiveId(0);
}, [pathname]);

  return (
    <WCContainer>
      <WCSidebar
        onBackdropClick={() => setShowSideNav(false)}
        breakPoint="lg"
        onBreakPoint={(broken: boolean) => setShowSideNav(!broken)}
        toggled={showSideNav}
        backgroundColor="white"
        rootStyles={{
          color: '#216A4C',
        }}
        width="320px"
      >
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <Image src={Logo} alt="" />
          <div style={{ flex: 1, marginBottom: '32px' }}>
            {(hasViewDashboardPermission ||
              hasViewProductsPermission ||
              hasViewOrdersPermission ||
              hasViewDiscrepanciesPermission ||
              hasViewPromotionsPermission ||
              hasViewPromotionClaimsPermission ||
              hasViewPromotionClaimsPaymentPermission ||
              hasViewUsersPermission ||
              hasViewPaymentsPermission ||
              hasViewActionablesFollowUpDeviceNotSentPermission ||
              hasViewActionablesFollowUpRecycleOfferPermission ||
              hasViewActionablesFollowUpRevisionOfferPermission ||
              hasViewActionablesForRecyclePermission ||
              hasViewActionablesForReturnPermission ||
              hasViewActionablesLockedDevicesCurrentLockPermission ||
              hasViewActionablesLockedDevicesForRetestPermission ||
              hasViewActionablesDevicesTakenForInventoryPermission) && (
              <div style={{ padding: '0 24px', marginBottom: '8px' }}>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  style={{ letterSpacing: '0.5px' }}
                >
                  General
                </Typography>
              </div>
            )}
            <WCMenu
              menuItemStyles={menuItemStyles}
              renderExpandIcon={(params: { open: boolean }) => (
                <StyledIcon icon={params.open ? faAngleDown : faAngleRight} />
              )}
              transitionDuration={400}
            >
              {filteredSideNavItems?.map((item, index) => {
                if (item.submenu) {
                  const filteredSideNavSubItems = item.submenu.filter(
                    (item) => {
                      switch (item.title) {
                        case 'Orders':
                          return hasViewOrdersPermission;

                        case 'Discrepancy':
                          return hasViewDiscrepanciesPermission;

                        case 'Follow-Up Device Not Sent':
                          return hasViewActionablesFollowUpDeviceNotSentPermission;

                        case 'Follow-Up Revision Offer':
                          return hasViewActionablesFollowUpRevisionOfferPermission;

                        case 'Follow-Up Recycle Offer':
                          return hasViewActionablesFollowUpRecycleOfferPermission;

                        case 'Locked Devices':
                          return hasViewActionablesLockedDevicesCurrentLockPermission || hasViewActionablesLockedDevicesForRetestPermission;

                        case 'Locked Devices - Current Lock':
                          return hasViewActionablesLockedDevicesCurrentLockPermission;

                        case 'Locked Devices - For Retest':
                          return hasViewActionablesLockedDevicesForRetestPermission;

                        case 'Payment Action Needed':
                          return hasViewActionablesPaymentActionNeededPermission;

                        case 'Devices With Box':
                          return hasViewActionablesDevicesWithBoxPermission;

                        case 'Devices For Return':
                          return hasViewActionablesForReturnPermission;

                        case 'Devices For Recycle':
                          return hasViewActionablesForRecyclePermission;

                        case 'Devices For Inventory':
                          return hasViewActionablesDevicesTakenForInventoryPermission;

                        case 'Promotions':
                          return hasViewPromotionsPermission;

                        case 'Claims':
                          return hasViewPromotionClaimsPermission;

                        case 'Payment':
                          return hasViewPromotionClaimsPaymentPermission;

                        case 'Products':
                          return hasViewProductsPermission;

                        case 'Upload Logs':
                          return hasViewProductsPermission;

                        case 'Payments':
                          return hasViewPaymentsPermission;

                        default:
                          return false;
                      }
                    },
                  );

                  return (
                    <WCSubMenu
                      label={item.title}
                      key={index}
                      icon={<StyledIcon icon={item.icon} />}
                      disabled={item.disabled}
                      onOpenChange={() => handleOnChangeActiveId(item.menuId)}
                      open={item.menuId === activeId}
                    >
                      {filteredSideNavSubItems?.map((subItem, subIndex) => (
                        <WCMenuItem
                          key={subIndex}
                          onClick={() => navigate(subItem.url)}
                          active={subItem.activeUrl?.test(pathname)}
                          disabled={subItem.disabled}
                          icon={<StyledIcon icon={subItem.icon} />}
                        >
                          {subItem.title}
                        </WCMenuItem>
                      ))}
                    </WCSubMenu>
                  );
                } else {
                  return (
                    <WCMenuItem
                      key={index}
                      onClick={() => {
                        navigate(item.url)
                        handleOnChangeActiveId(0)
                      }}
                      active={item.activeUrl?.test(pathname)}
                      icon={<StyledIcon icon={item.icon} />}
                      disabled={item.disabled}
                    >
                      {item.title}
                    </WCMenuItem>
                  );
                }
              })}
            </WCMenu>
            {hasViewPlatformConfigsPermissions && (
              <>
                <div
                  style={{
                    padding: '0 24px',
                    marginBottom: '8px',
                    marginTop: '16px',
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    style={{ letterSpacing: '0.5px' }}
                  >
                    Settings
                  </Typography>
                </div>

                <WCMenu
                  menuItemStyles={menuItemStyles}
                  renderExpandIcon={(params: { open: boolean }) => (
                    <StyledIcon
                      icon={params.open ? faAngleDown : faAngleRight}
                    />
                  )}
                  transitionDuration={400}
                >
                  {filteredSideNavSettingsItems.map((item, index) => {
                    if (item.submenu) {
                      const filteredSideNavSettingsSubItems =
                        item.submenu.filter((item) => {
                          switch (item.title) {
                            case 'Email':
                              return hasViewPlatformConfigsPermissions;

                            case 'SMS':
                              return hasViewPlatformConfigsPermissions;

                            case 'Approvals':
                              return hasViewPlatformConfigsPermissions;

                            default:
                              return false;
                          }
                        });

                      return (
                        <WCSubMenu
                          label={item.title}
                          key={index}
                          icon={<StyledIcon icon={item.icon} />}
                          disabled={item.disabled}
                          onOpenChange={() => handleOnChangeActiveId(item.menuId)}
                          open={item.menuId === activeId}
                        >
                          {filteredSideNavSettingsSubItems?.map(
                            (subItem, subIndex) => (
                              <WCMenuItem
                                key={subIndex}
                                onClick={() => navigate(subItem.url)}
                                active={subItem.activeUrl?.test(pathname)}
                                disabled={subItem.disabled}
                                icon={<StyledIcon icon={subItem.icon} />}
                              >
                                {subItem.title}
                              </WCMenuItem>
                            ),
                          )}
                        </WCSubMenu>
                      );
                    } else {
                      return (
                        <WCMenuItem
                          key={index}
                          onClick={() => {
                            navigate(item.url)
                            handleOnChangeActiveId(0)
                          }}
                          active={item.activeUrl?.test(pathname)}
                          icon={<StyledIcon icon={item.icon} />}
                          disabled={item.disabled}
                        >
                          {item.title}
                        </WCMenuItem>
                      );
                    }
                  })}
                </WCMenu>
              </>
            )}
          </div>
          <WCMenu menuItemStyles={menuItemStyles}>
            <WCMenuItem
              key="logout"
              onClick={() => logoutUser()}
              icon={<StyledIcon icon={faArrowRightFromBracket} />}
            >
              Logout
            </WCMenuItem>
          </WCMenu>
        </div>
      </WCSidebar>
    </WCContainer>
  );
}
