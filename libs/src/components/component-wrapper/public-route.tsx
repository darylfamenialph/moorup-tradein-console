import { isEmpty } from 'lodash';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_EXPIRY,
  ACTIVE_PLATFORM,
  ADMIN,
  CUSTOMER_SERVICE,
  PRODUCTS,
  REGULAR,
  SUPERADMIN,
  WAREHOUSE
} from '../../constants';
import { validateExpiry } from '../../helpers';
import { useAuth } from '../../store';

export function PublicRoute(): JSX.Element {
  const navigate = useNavigate();
  const {
    state,
    setLoading,
  } = useAuth();

  const {
    expiry,
    userDetails,
  } = state

  if (validateExpiry(expiry)) {
    if (!isEmpty(userDetails)) {
      switch (userDetails?.role) {
        case REGULAR:
          setLoading(false);
          navigate('/dashboard/promotion/list');
          break;
  
        case ADMIN:
          setLoading(false);
          navigate('/dashboard/product');
          break;
  
        case WAREHOUSE:
          setLoading(false);
          navigate('/dashboard/order/list');
          break;
  
        case PRODUCTS:
          setLoading(false);
          navigate('/dashboard/product');
          break;
  
        case CUSTOMER_SERVICE:
          setLoading(false);
          navigate('/dashboard/product');
          break;
  
        case SUPERADMIN:
          setLoading(false);
          navigate('/dashboard');
          break;
  
        default:
          // Redirect to 404 if role is not valid
          setLoading(false);
          navigate('/404');
          break;
      }
    }

    return <Navigate to="/dashboard" />;
  } else {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(ACCESS_TOKEN_EXPIRY);
    localStorage.removeItem(ACTIVE_PLATFORM);
  }

  return <Outlet />;
}
