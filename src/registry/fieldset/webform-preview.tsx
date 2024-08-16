import type {FieldsetComponentSchema} from '@open-formulieren/types';

import {FieldSet} from '@/components/formio';
import type {WebformPreviewProps} from '@/registry/types';

const WebformPreview: React.FC<WebformPreviewProps<FieldsetComponentSchema>> = ({
  component,
  renderSubtree,
}) => {
  const {label, hideHeader, tooltip, components} = component;
  return (
    <FieldSet label={hideHeader ? undefined : label} tooltip={tooltip}>
      {renderSubtree(components)}
    </FieldSet>
  );
};

export default WebformPreview;
