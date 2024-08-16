import type {FieldsetComponentSchema} from '@open-formulieren/types';

import type {StructureSubtreeProps} from '@/registry/types';

const StructureSubtreePreview: React.FC<StructureSubtreeProps<FieldsetComponentSchema>> = ({
  component: {components},
  renderSubtree,
}) => <>{renderSubtree(components)}</>;

export default StructureSubtreePreview;
