import React, {useContext} from 'react';

import Component from './component';

// Context
interface DataGridContextType {
  name: string;
}

const DataGridContext = React.createContext<DataGridContextType>({name: ''});
DataGridContext.displayName = 'DataGridContext';

// Single row inside the data grid

export interface DataGridRowProps {
  index: number;
  children: React.ReactElement[];
}

export const DataGridRow: React.FC<DataGridRowProps> = ({index, children}) => {
  const {name: dataGridName} = useContext(DataGridContext);
  return (
    <>
      {React.Children.map(children, (child, colIndex) => (
        <td key={colIndex}>
          {React.cloneElement(child, {name: `${dataGridName}[${index}].${child.props.name}`})}
        </td>
      ))}
    </>
  );
};

// Data grid container of rows

type DataGridChild = React.ReactComponentElement<typeof DataGridRow>;

export interface DataGridProps {
  name: string;
  label?: React.ReactNode;
  tooltip?: string;
  columns?: React.ReactNode[];
  type?: 'datagrid' | 'datamap';
  children: DataGridChild | DataGridChild[];
}

export const DataGrid: React.FC<DataGridProps> = ({
  name,
  label,
  tooltip = '',
  columns = [],
  type = 'datagrid',
  children,
}) => {
  const htmlId = `editform-${name}`;
  return (
    <Component type={type} label={label} tooltip={tooltip} htmlId={htmlId}>
      <table className="table datagrid-table table-bordered">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>

        <DataGridContext.Provider value={{name: name}}>
          <tbody>
            {React.Children.map(children, (child, index) => (
              <tr key={child.key || index}>{child}</tr>
            ))}
          </tbody>
        </DataGridContext.Provider>
      </table>
    </Component>
  );
};

export default DataGrid;
