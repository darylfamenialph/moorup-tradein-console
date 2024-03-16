/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import { isEmpty } from 'lodash';
import { CURRENCY_SYMBOLS } from '../constants';

export function createActionTypes(baseType: string) {
  return {
    baseType,
    SUCCESS: `${baseType}_SUCCESS`,
    FAILED: `${baseType}_FAILED`,
    CANCELLED: `${baseType}_CANCELLED`,
  };
}

export const amountFormatter = (amount: any, currency = 'PHP') => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    currencyDisplay: 'code',
  });

  return formattedAmount.format(Number(amount || 0))
    .replace(currency, '')
    .trim();
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const validateExpiry = (date: any) => {
  if (date && date !== '') {
    const currentTime = Date.now() / 1000; // Convert to seconds
    return date >= currentTime;
  }
  return false;
};

// 53-bit hash
export function cyrb53(str: string, seed = 0) {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;

  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

interface TokenPayload {
    id: string;
    exp: number;
    iat: number;
    iss: string;
    email: string;
}

export const decodeJWT = (token: string): TokenPayload | null => {
    try {
        return jwtDecode<TokenPayload>(token);
    } catch (error) {
        console.error('Invalid token', error);
        return null;
    }
};

export function getInitials(text: string) {
  const words = text.trim().split(' ');

  if (words.length === 0) {
    return '';
  }

  const firstInitial = words[0].charAt(0).toUpperCase();
  const lastInitial = words[words.length - 1].charAt(0).toUpperCase();

  return `${firstInitial}${lastInitial}`;
}

export function sortByKey(array: any[], key: string | number) {
  return array.sort((a: { [x: string]: number; }, b: { [x: string]: number; }) => {
    if (a[key] < b[key]) {
      return -1;
    }
    if (a[key] > b[key]) {
      return 1;
    }
    return 0;
  });
}

// export function sortArray<T>(array: T[], key: string, direction: string): T[] {
//   const compare = (a: T, b: T) => {
//     const aValue = ((a as any)[key])?.toLowerCase();
//     const bValue = ((b as any)[key])?.toLowerCase();

//     if (direction === 'asc') {
//       return aValue?.localeCompare(bValue);
//     } else {
//       return bValue?.localeCompare(aValue);
//     }
//   };

//   return array.slice().sort(compare);
// }

// export function sortArray<T>(array: T[], key: string, direction: string): T[] {
//   const getValue = (obj: any, nestedKey: string) => {
//     const keys = nestedKey.split('.');
//     let value = obj;
//     for (const k of keys) {
//       value = value[k];
//       if (value === undefined) return undefined;
//     }
//     return value;
//   };

//   const compare = (a: T, b: T) => {
//     const aValue = getValue(a, key)?.toString().toLowerCase();
//     const bValue = getValue(b, key)?.toString().toLowerCase();

//     if (direction === 'asc') {
//       return aValue?.localeCompare(bValue);
//     } else {
//       return bValue?.localeCompare(aValue);
//     }
//   };

//   return array.slice().sort(compare);
// }

export function sortArray<T>(array: T[], key: string, direction: string): T[] {
  const getValue = (obj: any, nestedKey: string) => {
    const keys = nestedKey.split('.');
    let value = obj;
    for (const k of keys) {
      if (!value || typeof value !== 'object') return undefined;
      value = value[k];
      if (value === undefined) return undefined;
    }
    return value;
  };

  const compare = (a: T, b: T) => {
    const aValue = getValue(a, key)?.toString().toLowerCase();
    const bValue = getValue(b, key)?.toString().toLowerCase();

    if (direction === 'asc') {
      return aValue?.localeCompare(bValue);
    } else {
      return bValue?.localeCompare(aValue);
    }
  };

  return array.slice().sort(compare);
}

export function parseDateString(inputDateString: string) {
  const date = new Date(inputDateString);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const formattedDateString = `${year}-${month}-${day}`;
  
  return formattedDateString;
}

export function hasEmptyValue(obj: any): boolean {
  const isEmpty = (value: any): boolean => {
    if ((typeof value === 'object' || typeof value === 'number') && value !== null) {
      return hasEmptyValue(value);
    }
    return value === '' || value === null;
  };

  if (Array.isArray(obj)) {
    return obj.some((element) => isEmpty(element));
  } else {
    return Object.values(obj).some((value) => {
      if (typeof value === 'boolean') {
        return false;
      }
      return isEmpty(value);
    });
  }
}

export function hasEmptyValueInArray(objArray: any[]): boolean {
  return objArray?.some((obj) =>
    Object.values(obj)?.some((value) => {
      if (typeof value === 'boolean' || typeof value === 'number') {
        return false;
      }

      if (Array.isArray(value)) {
        return hasEmptyValueInArray(value);
      }

      return isEmpty(value);
    })
  );
}

const productHeaders = [
  { label: 'ID', key: '_id' },
  { label: 'Brand', key: 'brand' },
  { label: 'Model', key: 'model' },
  { label: 'Year', key: 'year' },
  { label: 'Display Name', key: 'display_name' },
  { label: 'Image URL', key: 'image_url' },
  { label: 'Type', key: 'type' },
  { label: 'Category', key: 'category' },
  { label: 'Site URL', key: 'site_url' },
  { label: 'Name', key: 'name' },
  { label: 'Status', key: 'status' },
];

const pricingHeaders = [
  { label: 'Platform', key: 'platform' },
  { label: 'Currency', key: 'currency' },
  { label: 'Amount', key: 'amount' },
  { label: 'Working', key: 'working' },
  { label: 'Working Damaged', key: 'working_damaged' },
  { label: 'Not Working Damaged', key: 'not_working_damaged' },
  { label: 'Not Working', key: 'not_working' },
];

export function exportToCSV(data: any) {
  const csvData = data.flatMap(
    (item: any) =>
      item.variants?.map((variant: any) => [
        ...productHeaders.map((header) => item[header.key]),
        ...pricingHeaders.map(
          (header) => variant.pricing[0]?.[header.key] || ''
        ),
        variant.name || '',
      ]) || [
        [
          ...productHeaders.map((header) => item[header.key]),
          ...pricingHeaders.map(() => ''),
          '',
        ],
      ]
  );

  const csvContent = [
    [
      ...productHeaders.map((header) => header.label),
      ...pricingHeaders.map((header) => header.label),
      'Variant Name',
    ],
    ...csvData,
  ]
    .map((row) => row.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const filename = 'products_data.csv';

  const link = document.createElement('a');
  if (link.download !== undefined) {
    // Browsers that support HTML5 download attribute
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export async function isImageUrl(url: string): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    
    // Set a timeout to handle the case when the request takes too long to load
    const timeout = setTimeout(() => {
      img.src = '';
      resolve(false);
    }, 500);

    // Clear the timeout if the image loads successfully
    img.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };
  });
}

export function compareObjects(currentObject: any, newObject: any) {
  const currentKeys = Object.keys(currentObject);
  const newKeys = Object.keys(newObject);

  if (currentKeys.length !== newKeys.length) return false;

  // eslint-disable-next-line max-len
  return currentKeys.every((key: string) => Object.prototype.hasOwnProperty.call(newObject, key) && currentObject[key] === newObject[key]);
}

export function compareArrays(currentArray: any[], newArray: any[]): boolean {
  if (currentArray.length !== newArray.length) return false;

  return currentArray.every((currentValue, index) => {
    const newValue = newArray[index];
    if (typeof currentValue === 'object' && typeof newValue === 'object') {
      return compareObjects(currentValue, newValue);
    }
    return currentValue === newValue;
  });
}

export function compareJSON(obj1: any, obj2: any): boolean {
  // Check if both arguments are objects
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return obj1 === obj2;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if both objects have the same number of keys
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Check if all keys in obj1 are present in obj2 and have the same values
  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }
    if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      // If both values are objects or arrays, recursively compare them
      if (!compareJSON(obj1[key], obj2[key])) {
        return false;
      }
    } else if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
      // If both values are arrays, compare them element by element
      if (obj1[key].length !== obj2[key].length) {
        return false;
      }
      for (let i = 0; i < obj1[key].length; i++) {
        if (!compareJSON(obj1[key][i], obj2[key][i])) {
          return false;
        }
      }
    } else if (obj1[key] !== obj2[key]) {
      // If values are not objects or arrays, compare them directly
      return false;
    }
  }

  return true;
}

export function formatDateString(inputDateString: string) {
  const date = new Date(inputDateString);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  const formattedDateString = `${year}-${month}-${day} ${hours}:${minutes}`;
  
  return formattedDateString;
}

export function getCurrencySymbol(currencyCode: string) {
  return CURRENCY_SYMBOLS[currencyCode] || null;
}

export const formatDate = (date: Date, format='MM/DD/YYYY') => {
  return dayjs(date).format(format);
}

export const displayData = (label: string, value: any) => {
  return (
    <>
      <dl className="font-semibold capitalize">{label}</dl>
      <dt className="truncate capitalize">{value || '---'}</dt>
    </>
  );
};
