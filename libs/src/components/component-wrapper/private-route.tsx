/* eslint-disable no-case-declarations */
/* eslint-disable react-hooks/exhaustive-deps */
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { validateExpiry } from '../../helpers';
import { usePermission } from '../../hooks';
import { useAuth } from '../../store';
import { SideBar, TopNavBar } from '../navigation';
import { CardContainer } from './card-container';
import { PageContainer } from './page-container';
import { ComponentWrapper } from './wrapper';

interface Permissions {
  [path: string]: boolean;
}

export function PrivateRoute(): JSX.Element {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {
    state, setLoading,
  } = useAuth();

  const {
    expiry,
    userDetails,
  } = state

  const {
    hasViewDashboardPermission,
    hasViewProductsPermission,
    hasViewOrdersPermission,
    hasViewDiscrepanciesPermission,
    hasViewActionablesPermission,
    hasViewPromotionsPermission,
    hasViewPromotionClaimsPermission,
    hasViewPromotionClaimsPaymentPermission,
    hasViewUsersPermission,
    hasViewPlatformConfigsPermissions,
    hasViewOrderDetailsPermission,
    hasEditProductPermission,
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
  } = usePermission();

  useEffect(() => {
    if (!isEmpty(userDetails)) {
      const permissions: Permissions = {
        '/dashboard': hasViewDashboardPermission,
        '/dashboard/product/list': hasViewProductsPermission,
        '/dashboard/order/list': hasViewOrdersPermission,
        '/dashboard/order/discrepancy': hasViewDiscrepanciesPermission,
        '/dashboard/order/actionables': hasViewActionablesPermission,
        '/dashboard/actionables/follow-up-device-not-sent': hasViewActionablesFollowUpDeviceNotSentPermission,
        '/dashboard/actionables/follow-up-revision-offer': hasViewActionablesFollowUpRevisionOfferPermission,
        '/dashboard/actionables/follow-up-recycle-offer': hasViewActionablesFollowUpRecycleOfferPermission,
        '/dashboard/actionables/locked-devices': hasViewActionablesLockedDevicesCurrentLockPermission || hasViewActionablesLockedDevicesForRetestPermission,
        '/dashboard/actionables/locked-devices-current-lock': hasViewActionablesLockedDevicesCurrentLockPermission,
        '/dashboard/actionables/locked-devices-for-retest': hasViewActionablesLockedDevicesForRetestPermission,
        '/dashboard/actionables/payment-action-needed': hasViewActionablesPaymentActionNeededPermission,
        '/dashboard/actionables/devices-for-return': hasViewActionablesForReturnPermission,
        '/dashboard/actionables/devices-for-recycle': hasViewActionablesForRecyclePermission,
        '/dashboard/actionables/devices-with-box': hasViewActionablesDevicesWithBoxPermission,
        '/dashboard/order/payments': hasViewPaymentsPermission,
        '/dashboard/promotion/list': hasViewPromotionsPermission,
        '/dashboard/promotion/claims': hasViewPromotionClaimsPermission,
        '/dashboard/promotion/payment': hasViewPromotionClaimsPaymentPermission,
        '/dashboard/user': hasViewUsersPermission,
        '/dashboard/configurations': hasViewPlatformConfigsPermissions,
        '/dashboard/templates/email': hasViewPlatformConfigsPermissions,
        '/dashboard/templates/sms': hasViewPlatformConfigsPermissions,
        '/dashboard/templates/approvals': hasViewPlatformConfigsPermissions,
        // There should be no static entry for dynamic paths in the permissions object
      };

      let redirectTo = null;

      // Remove possible trailing slash from pathname
      const cleanPathname = pathname.replace(/\/$/, '');

      const checkPermission = (path: string) => {
        if (permissions[path] !== undefined) {
          return permissions[path];
        }

        const dynamicPaths = [
          { pattern: /^\/dashboard\/order\/[^/]+$/, permission: hasViewOrderDetailsPermission },
          { pattern: /^\/dashboard\/product\/[^/]+$/, permission: hasEditProductPermission },
          { pattern: /^\/dashboard\/templates\/approvals\/[^/]+$/, permission: hasViewPlatformConfigsPermissions },
        ];

        for (const { pattern, permission } of dynamicPaths) {
          if (pattern.test(path)) {
            return permission;
          }
        }
        return null;
      };

      // Check if user has permission for the current path
      if (!checkPermission(cleanPathname)) {
        // If user doesn't have permission for the current path, find the first path with permissions
        Object.entries(permissions).some(([path, permission]) => {
          if (permission) {
            redirectTo = path.includes('/:id') ? '/dashboard' : path; // Redirect dynamic path to a safe default
            return true; // Stop iterating once a path with permissions is found
          }
          return false;
        });
      } else {
        redirectTo = cleanPathname;
      }

      if (!redirectTo) {
        // If no path with permissions found, default to '/404'
        redirectTo = '/404';
      }

      setLoading(false);
      navigate(redirectTo);
    }
  }, [userDetails]);

  if (!validateExpiry(expiry)) {
    return <Navigate to="/" />;
  }

  return (
    <ComponentWrapper>
      <PageContainer>
        <SideBar />
        <CardContainer>
          <TopNavBar />
          <Outlet />
        </CardContainer>
      </PageContainer>
    </ComponentWrapper>
  );
}
