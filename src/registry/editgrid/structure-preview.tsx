import type {EditGridComponentSchema} from '@open-formulieren/types';
import {FormattedMessage} from 'react-intl';

import type {StructureSubtreeProps} from '@/registry/types';

const StructureSubtreePreview: React.FC<StructureSubtreeProps<EditGridComponentSchema>> = ({
  component: {components},
  renderSubtree,
}) => (
  <>
    <span className="offb-form-preview-editgrid-description">
      <FormattedMessage
        description="Edit grid structure preview description"
        defaultMessage="Every item has:"
      />
    </span>
    {renderSubtree(components)}
  </>
);

export default StructureSubtreePreview;
