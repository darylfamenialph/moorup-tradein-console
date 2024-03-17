/* eslint-disable no-case-declarations */
/* eslint-disable react-hooks/exhaustive-deps */
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ADMIN,
  CUSTOMER_SERVICE,
  PRODUCTS,
  REGULAR,
  SUPERADMIN,
  WAREHOUSE
} from '../../constants';
import { validateExpiry } from '../../helpers';
import { useAuth } from '../../store';
import { SideBar, TopNavBar } from '../navigation';
import { CardContainer } from './card-container';
import { PageContainer } from './page-container';
import { ComponentWrapper } from './wrapper';

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

  useEffect(() => {
    if (!isEmpty(userDetails)) {
      let activeUrl = /\/dashboard/;

      switch (userDetails?.role) {
        case REGULAR:
          setLoading(false);

          activeUrl = /^\/dashboard\/claims/;
          if (!activeUrl?.test(pathname)) {
            navigate('/dashboard/claims');
          }
          break;
  
        case ADMIN:
          setLoading(false);
          activeUrl = /^\/dashboard\/(product|order|user|promotions)/;
          if (!activeUrl?.test(pathname)) {
            navigate('/dashboard/product');
          }
          break;
  
        case WAREHOUSE:
          setLoading(false);
          activeUrl = /^\/dashboard\/order/;
          if (!activeUrl?.test(pathname)) {
            navigate('/dashboard/order');
          }
          break;
  
        case PRODUCTS:
          setLoading(false);
          activeUrl = /^\/dashboard\/product/;
          if (!activeUrl?.test(pathname)) {
            navigate('/dashboard/product');
          }
          break;
  
        case CUSTOMER_SERVICE:
          setLoading(false);
          activeUrl = /^\/dashboard\/product/;
          if (!activeUrl?.test(pathname)) {
            navigate('/dashboard/product');
          }
          break;
  
        case SUPERADMIN:
          setLoading(false);
          activeUrl = /\/dashboard/;
          if (!activeUrl?.test(pathname)) {
            navigate('/dashboard');
          }
          break;
  
        default:
          // Redirect to 404 if role is not valid
          setLoading(false);
          navigate('/404');
          break;
      }
    }
  }, [userDetails])

  if (!validateExpiry(expiry)) {
    return <Navigate to="/" />;
  }
  
  return (
    <ComponentWrapper>
      <TopNavBar />
      <PageContainer>
        <SideBar />
        <CardContainer>
          <Outlet />
        </CardContainer>
      </PageContainer>
    </ComponentWrapper>
  );
}
