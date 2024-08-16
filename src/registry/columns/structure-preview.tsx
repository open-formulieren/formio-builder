import type {ColumnsComponentSchema} from '@open-formulieren/types';
import {FormattedMessage} from 'react-intl';

import type {StructureSubtreeProps} from '@/registry/types';

const StructureSubtreePreview: React.FC<StructureSubtreeProps<ColumnsComponentSchema>> = ({
  component: {columns},
  renderSubtree,
}) => {
  return (
    <>
      {columns.map(({components}, index) => (
        <div key={`column-${index}`} className="offb-form-preview-column">
          <span className="offb-form-preview-column__label">
            <FormattedMessage
              description="Columns component: label for column in structure preview"
              defaultMessage="Column {index} (of {total})"
              values={{index: index + 1, total: columns.length}}
            />
          </span>
          {renderSubtree(components)}
        </div>
      ))}
    </>
  );
};

export default StructureSubtreePreview;
