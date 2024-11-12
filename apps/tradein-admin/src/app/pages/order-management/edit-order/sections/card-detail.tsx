/* eslint-disable react-hooks/exhaustive-deps */
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import {
  CopyToClipboardButton,
  StyledIcon,
  useAuth,
  useOrder,
  usePermission,
} from '@tradein-admin/libs';
import { useEffect, useState } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
type CardDetailProps = {
  label: any;
  value: any;
  copy?: boolean;
  edit?: boolean;
  orderId?: string;
  orderItem?: any;
  isLink?: boolean;
  linkUrl?: string;
};

export const CardDetail = ({
  label,
  value,
  copy,
  edit,
  orderId,
  orderItem,
  isLink,
  linkUrl,
}: CardDetailProps) => {
  const { state: authState } = useAuth();
  const { activePlatform } = authState;

  const [editing, setEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);
  const [isImeiValid, setIsImeiValid] = useState(true);

  const { updateOrderItemImeiSerial } = useOrder();
  const { hasEditIMEISerialPermission } = usePermission();

  const serialQuestion: Record<string, any> = {
    phones: {
      type: 'IMEI',
    },
    tablets: {
      type: 'Serial',
    },
    watches: {
      type: 'Serial',
    },
    laptops: {
      type: 'Serial',
    },
  };

  const isValidIMEI = (imei: string): boolean => {
    if (imei === '' || imei === undefined || imei === null) {
      return false;
    }

    const regex = /^\d{15}$/; // IMEI should be exactly 15 digits
    if (!regex.test(imei)) {
      return false;
    }

    return true;
  };

  const isValidSerial = (serial: string): boolean => {
    if (serial === '' || serial === undefined || serial === null) {
      return false;
    }

    const regex = /^[a-zA-Z0-9]{7,32}$/;
    if (!regex.test(editedValue)) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (serialQuestion[orderItem?.product_type]?.type === 'IMEI') {
      setIsImeiValid(isValidIMEI(editedValue));
    } else {
      setIsImeiValid(isValidSerial(editedValue));
    }
  }, [editedValue]);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSave = () => {
    // Validate length and value here

    updateOrderItemImeiSerial(orderItem?._id, orderId, {
      imei_serial: editedValue,
      platform: activePlatform,
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedValue(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (serialQuestion[orderItem?.product_type]?.type === 'IMEI') {
      // Allow only numeric values and limit length
      const numericValue = value.replace(/\D/g, '').slice(0, 15);
      setEditedValue(numericValue);
    } else {
      // Allow only alphanumeric values and limit length
      const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 32);
      setEditedValue(alphanumericValue);
    }
  };

  return (
    <>
      <dl className="flex font-semibold whitespace-nowrap capitalize pr-6">
        {label}
      </dl>
      {editing ? (
        <div className="flex items-center">
          <input
            type="text"
            value={editedValue}
            onChange={handleChange}
            className={`bg-white w-full align-center p-1 shadow-sm border-2 border-emerald-900 rounded-md mr-2 focus:border-emerald border-1 border-solid outline-none ${isImeiValid ? '' : 'border-red-500'}`}
          />
          <button
            onClick={handleSave}
            className="text-sm text-emerald-900 hover:text-emerald-700 mr-2"
            disabled={!isImeiValid}
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      ) : (
        <dt className="flex items-center break-normal capitalize pb-2 sm:pb-0">
          {isLink ? (
            <a target="_blank" href={linkUrl}>
              {value}
            </a>
          ) : (
            value || '---'
          )}
          {copy && value && <CopyToClipboardButton textToCopy={value} />}
          {edit && value && hasEditIMEISerialPermission && (
            <button
              onClick={handleEditClick}
              className="text-gray-500 hover:text-gray-700"
            >
              <StyledIcon icon={faEdit} />{' '}
            </button>
          )}
        </dt>
      )}
    </>
  );
};
