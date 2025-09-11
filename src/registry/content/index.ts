import {ContentComponentSchema} from '@open-formulieren/types';

import {RegistryEntry} from '../types';
import EditForm from './edit';
import validationSchema from './edit-validation';
import WebformPreview from './webform-preview';

const SUMMARY_TRUNCATE_SIZE = 20;

export default {
  edit: EditForm,
  editSchema: validationSchema,
  getSummary: component => {
    // use browser to strip tags
    const doc = new DOMParser().parseFromString(component.html, 'text/html');
    const summary = doc.body.textContent || component.id;
    if (summary.length <= SUMMARY_TRUNCATE_SIZE) return summary;
    return `${summary.substring(0, SUMMARY_TRUNCATE_SIZE - 1)}…`;
  },
  preview: {
    panel: null,
    webform: WebformPreview,
  },
  defaultValue: undefined, // a content component does not hold a value itself
} satisfies RegistryEntry<ContentComponentSchema>;
