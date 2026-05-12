import type {ChildrenComponentSchema} from '@open-formulieren/types';

import Component from '@/components/formio/component';
import Description from '@/components/formio/description';

import type {ComponentPreviewProps} from '../types';

const Preview: React.FC<ComponentPreviewProps<ChildrenComponentSchema>> = ({component}) => {
  const {key, description, label, tooltip, enableSelection} = component;

  return (
    <Component
      type="children"
      field={key}
      htmlId={`editform-${key}`}
      label={label}
      tooltip={tooltip}
    >
      <table className="table table-sm table-striped">
        <thead>
          <tr>
            {enableSelection && <th scope="col"></th>}
            <th scope="col">Bsn</th>
            <th scope="col">Firstnames</th>
            <th scope="col">Date of birth</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {enableSelection && (
              <td scope="row">
                <input type="checkbox" />
              </td>
            )}
            <td>xxxxxx123</td>
            <td>Alice</td>
            <td>2000-01-01</td>
          </tr>
          <tr>
            {enableSelection && (
              <td scope="row">
                <input type="checkbox" />
              </td>
            )}
            <td>xxxxxx456</td>
            <td>Bob</td>
            <td>2003-10-16</td>
          </tr>
        </tbody>
      </table>
      {description && <Description text={description} />}
    </Component>
  );
};

export default Preview;
