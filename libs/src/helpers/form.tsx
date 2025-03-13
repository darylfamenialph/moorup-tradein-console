/* eslint-disable @typescript-eslint/no-explicit-any */
import { capitalize, get, isEmpty } from 'lodash';

export const extractInitialValue = (template: any[] = []) => {
  const initialValue: any = {};

  template.forEach((section) => {
    const sectionData: any = {};
    const sectionList: any[] = [];
    section?.content?.forEach((field: any, idx: number) => {
      if (field.label) {
        sectionData[field.label] = field.value;
      } else {
        sectionList.push(field.value);
      }
    });

    initialValue[section.field] = !isEmpty(sectionData) ? sectionData : sectionList;
  })

  return initialValue;
}

export const parseTemplateValue = (template: any[], formValues: any) => {
  const templateValue: any = [...template];

  templateValue.map((section: any) => {
    section.content = section?.content?.map((field: any, idx: number) => {
      const fieldId = field.label
          ? `${section.field}.${field.label}`
          : `${section.field}[${idx}]`;

      field.value = get(formValues, fieldId);

      return field;
    });

    return section;
  })

  return templateValue;
}

export const formatToReadable = (title = '') => {
  return capitalize(title?.replace(/[_-]/g, ' '));
}
