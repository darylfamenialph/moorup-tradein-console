import { NotFound, PrivateRoute, PublicRoute } from '@tradein-admin/libs';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import {
  ConfigurationsPage,
  DashboardPage,
  DeviceCreditChargeNeededPage,
  DevicesForRecyclePage,
  DevicesForReturnPage,
  DevicesForInventoryPage,
  DevicesWithBoxPage,
  DiscrepancyPage,
  EditOrderPage,
  EditProductPage,
  EmailTemplatesPage,
  FollowUpRecycleOfferPage,
  FollowUpRevisionOfferPage,
  FollowUpUnsentDevicePage,
  LockedDevicesCurrentLockPage,
  LockedDevicesForRetestPage,
  LockedDevicesPage,
  LoginPage,
  OrderManagementPage,
  PaymentPage,
  ProductManagementPage,
  ProductUploadLogsPage,
  PromotionClaimsPage,
  PromotionClaimsPaymentPage,
  PromotionsPage,
  SmsTemplatesPage,
  TemplateApprovalByIdPage,
  TemplateApprovalPage,
  UploadPaymentErrorPage,
  UploadProductErrorPage,
  UploadProductPricingErrorPage,
  UserManagementPage,
} from './pages';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Will redirect unauthenticated users to /login */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard/" element={<DashboardPage />} />
          <Route path="/dashboard/product/:id" element={<EditProductPage />} />
          <Route path="/dashboard/order/:id" element={<EditOrderPage />} />
          <Route
            path="/dashboard/templates/approvals/:id"
            element={<TemplateApprovalByIdPage />}
          />
          <Route
            path="/dashboard/product/list"
            element={<ProductManagementPage />}
          />
          <Route
            path="/dashboard/product/upload-pricing-details"
            element={<UploadProductPricingErrorPage />}
          />
          <Route
            path="/dashboard/product/upload-details"
            element={<UploadProductErrorPage />}
          />
          <Route
            path="/dashboard/product/upload-logs"
            element={<ProductUploadLogsPage />}
          />
          <Route
            path="/dashboard/order/list"
            element={<OrderManagementPage />}
          />
          <Route
            path="/dashboard/order/discrepancy"
            element={<DiscrepancyPage />}
          />
          <Route path="/dashboard/order/payments" element={<PaymentPage />} />
          <Route
            path="/dashboard/order/payments-upload-details"
            element={<UploadPaymentErrorPage />}
          />
          <Route
            path="/dashboard/actionables/follow-up-device-not-sent"
            element={<FollowUpUnsentDevicePage />}
          />
          <Route
            path="/dashboard/actionables/follow-up-revision-offer"
            element={<FollowUpRevisionOfferPage />}
          />
          <Route
            path="/dashboard/actionables/follow-up-recycle-offer"
            element={<FollowUpRecycleOfferPage />}
          />
          <Route
            path="/dashboard/actionables/locked-devices"
            element={<LockedDevicesPage />}
          />
          <Route
            path="/dashboard/actionables/locked-devices-current-lock"
            element={<LockedDevicesCurrentLockPage />}
          />
          <Route
            path="/dashboard/actionables/locked-devices-for-retest"
            element={<LockedDevicesForRetestPage />}
          />
          <Route
            path="/dashboard/actionables/payment-action-needed"
            element={<DeviceCreditChargeNeededPage />}
          />
          <Route
            path="/dashboard/actionables/devices-with-box"
            element={<DevicesWithBoxPage />}
          />
          <Route
            path="/dashboard/actionables/devices-for-return"
            element={<DevicesForReturnPage />}
          />
          <Route
            path="/dashboard/actionables/devices-for-recycle"
            element={<DevicesForRecyclePage />}
          />
          <Route
            path="/dashboard/actionables/devices-for-inventory"
            element={<DevicesForInventoryPage />}
          />
          <Route path="/dashboard/user" element={<UserManagementPage />} />
          <Route
            path="/dashboard/promotion/list"
            element={<PromotionsPage />}
          />
          <Route
            path="/dashboard/promotion/claims"
            element={<PromotionClaimsPage />}
          />
          <Route
            path="/dashboard/promotion/payment"
            element={<PromotionClaimsPaymentPage />}
          />
          <Route
            path="/dashboard/configurations"
            element={<ConfigurationsPage />}
          />
          <Route
            path="/dashboard/templates/email"
            element={<EmailTemplatesPage />}
          />
          <Route
            path="/dashboard/templates/sms"
            element={<SmsTemplatesPage />}
          />
          <Route
            path="/dashboard/templates/approvals"
            element={<TemplateApprovalPage />}
          />
        </Route>

        {/* Will redirect authenticated users to /dashboard */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
