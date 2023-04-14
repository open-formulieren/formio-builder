import {useField} from 'formik';
import React from 'react';

import DataGrid, {DataGridRow} from './datagrid';
import TextField from './textfield';

export interface DataMapProps {
  name: string;
  valueComponent: React.ReactElement;
  keyLabel: React.ReactNode;
}

/**
 * Data map with readonly keys.
 */
export const DataMap: React.FC<DataMapProps> = ({name, valueComponent, keyLabel = 'Key'}) => {
  const [{value}, , {setValue}] = useField(name);
  const transformedValue = Object.entries(value).map(([key, value]) => ({key, value}));
  const columns = [keyLabel, valueComponent.props.label];
  return (
    <DataGrid name={name} columns={columns} type="datagrid">
      {transformedValue.map((item, index) => (
        <DataGridRow key={item.key} index={index}>
          <TextField name="key" readOnly value={item.key} />
          {React.cloneElement(valueComponent, {
            ...valueComponent.props,
            label: '',
            value: item.value,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
              const newValue = {...value, [item.key]: event.target.value};
              setValue(newValue);
            },
          })}
        </DataGridRow>
      ))}
    </DataGrid>
  );
};

export default DataMap;
