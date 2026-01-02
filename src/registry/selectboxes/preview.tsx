import {SelectboxesComponentSchema} from '@open-formulieren/types';
import {useContext} from 'react';
import {useIntl} from 'react-intl';
import useAsync from 'react-use/esm/useAsync';

import {ReferenceListsTableItem} from '@/components/builder/values/reference-lists/types';
import {transformItems} from '@/components/builder/values/reference-lists/utils';
import {SelectBoxes} from '@/components/formio';
import {BuilderContext} from '@/context';

import {ComponentPreviewProps} from '../types';
import {checkIsReferenceListsOptions, checkIsVariableOptions} from './helpers';

/**
 * Show a formio selectboxes component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<SelectboxesComponentSchema>> = ({component}) => {
  const intl = useIntl();
  const {key, label, description, tooltip, validate} = component;
  const {required = false} = validate || {};
  const {getReferenceListsTableItems} = useContext(BuilderContext);

  const {
    value: options = [],
    loading,
    error,
  } = useAsync(async () => {
    if (checkIsVariableOptions(component)) {
      return [
        {
          value: 'itemsExpression',
          label: intl.formatMessage(
            {
              description: 'Selectboxes dummy option for itemsExpression',
              defaultMessage: 'Options from expression: <code>{expression}</code>',
            },
            {
              expression: JSON.stringify(component.openForms.itemsExpression),
              code: chunks => <code>{chunks}</code>,
            }
          ),
        },
      ];
    }
    if (checkIsReferenceListsOptions(component)) {
      const items: ReferenceListsTableItem[] = await getReferenceListsTableItems(
        component?.openForms?.service || '',
        component?.openForms?.code || ''
      );
      return items ? transformItems(items, intl) : [];
    }

    // fallback should not be necessary, but we're not 100% sure all existing components
    // are correct.
    return component.values || [];
  }, [component]);

  if (error) {
    throw error;
  }

  return (
    <SelectBoxes
      name={key}
      options={options}
      label={label}
      tooltip={tooltip}
      required={required}
      description={description}
      isLoading={loading}
    />
  );
};

export default Preview;
