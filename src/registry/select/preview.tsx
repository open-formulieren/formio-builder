import {SelectComponentSchema} from '@open-formulieren/types';
import {useContext} from 'react';
import {useIntl} from 'react-intl';
import useAsync from 'react-use/esm/useAsync';

import {ReferentielijstenTabelItem} from '@/components/builder/values/referentielijsten/types';
import {transformItems} from '@/components/builder/values/referentielijsten/utils';
import {Select} from '@/components/formio';
import {BuilderContext} from '@/context';

import {ComponentPreviewProps} from '../types';
import {
  checkIsManualOptions,
  checkIsReferentielijstenOptions,
  checkIsVariableOptions,
} from './helpers';

/**
 * Show a formio select component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<SelectComponentSchema>> = ({component}) => {
  const intl = useIntl();
  const {key, label, description, tooltip, validate, multiple} = component;
  const {required = false} = validate || {};
  const {getReferentielijstenTabelItems} = useContext(BuilderContext);

  const {
    value: options = [],
    loading,
    error,
  } = useAsync(async () => {
    if (checkIsManualOptions(component)) {
      return component?.data?.values || [];
    }
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

    if (checkIsReferentielijstenOptions(component)) {
      const items: ReferentielijstenTabelItem[] = await getReferentielijstenTabelItems(
        component.openForms?.service || '',
        component.openForms?.code || ''
      );
      return items ? transformItems(items, intl) : [];
    }

    return [];
  }, [component]);

  if (error) {
    throw error;
  }

  return (
    <Select
      name={key}
      options={options}
      label={label}
      tooltip={tooltip}
      required={required}
      description={description}
      isMulti={!!multiple}
      isClearable
      isLoading={loading}
    />
  );
};

export default Preview;
