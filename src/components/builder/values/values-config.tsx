import {getIn, useFormikContext} from 'formik';
import {useLayoutEffect} from 'react';

import ItemsExpression from './items-expression';
import {ReferenceListsServiceSelect, ReferenceListsTableCode} from './reference-lists';
import {SchemaWithDataSrc} from './types';
import ValuesSrc from './values-src';
import ValuesTable, {ValuesTableProps} from './values-table';

export interface ValuesConfigProps<T> {
  name: ValuesTableProps<T>['name'];
  withOptionDescription?: boolean;
}

/**
 * The `ValuesConfig` component allows a form builder to specify available options.
 *
 * Certain component types like dropdowns, radio fields and multi-option fields present
 * a pre-configured list of available options to the end-user. This component is used to
 * do this pre-configuration.
 *
 * Options can either be provided manually upfront, or they can be set dynamically by
 * referencing other variables in the form evaluation context.
 */
export function ValuesConfig<T extends SchemaWithDataSrc>({
  name,
  withOptionDescription,
}: ValuesConfigProps<T>) {
  const {values, setFieldValue} = useFormikContext<T>();
  const {dataSrc} = values.openForms;

  // synchronize form state with the dataSrc value, and ensure this is done *before* the
  // browser repaints to prevent race conditions
  useLayoutEffect(() => {
    switch (dataSrc) {
      case 'manual': {
        if (values.openForms.hasOwnProperty('itemsExpression')) {
          setFieldValue('openForms.itemsExpression', undefined);
        }
        if (values.openForms.hasOwnProperty('code')) {
          setFieldValue('openForms.code', undefined);
        }
        if (values.openForms.hasOwnProperty('service')) {
          setFieldValue('openForms.service', undefined);
        }
        const currentValues = getIn(values, name);
        if (!currentValues || (Array.isArray(currentValues) && currentValues.length === 0)) {
          setFieldValue(name, [{value: '', label: '', openForms: {translations: {}}}]);
        }
        break;
      }
      case 'variable': {
        setFieldValue(name, []);
        if (values.openForms.hasOwnProperty('code')) {
          setFieldValue('openForms.code', undefined);
        }
        if (values.openForms.hasOwnProperty('service')) {
          setFieldValue('openForms.service', undefined);
        }
        break;
      }
      case 'referenceLists': {
        setFieldValue(name, []);
        if (values.openForms.hasOwnProperty('itemsExpression')) {
          setFieldValue('openForms.itemsExpression', undefined);
        }
        break;
      }
    }
    // deliberate that we only provide dataSrc as dependency, the hook should only run
    // when that dropdown changes value.
  }, [dataSrc]);

  return (
    <>
      <ValuesSrc />
      {dataSrc === 'manual' && (
        <ValuesTable<T> name={name} withOptionDescription={withOptionDescription} />
      )}
      {dataSrc === 'variable' && <ItemsExpression />}
      {dataSrc === 'referenceLists' && (
        <>
          <ReferenceListsServiceSelect />
          <ReferenceListsTableCode />
        </>
      )}
    </>
  );
}

export default ValuesConfig;
