import type {ColumnsComponentSchema} from '@open-formulieren/types';

import type {WebformPreviewProps} from '@/registry/types';

/**
 * Show a formio columns component preview.
 */
const WebformPreview: React.FC<WebformPreviewProps<ColumnsComponentSchema>> = ({
  component: {columns},
  renderSubtree,
}) => (
  <div className="offb-columns-preview offb-columns-preview--ui">
    {columns.map((column, index) => (
      <div
        key={`column-${index}`}
        className="offb-columns-preview__column"
        style={{'--_col-preview-span': column.size} as React.CSSProperties}
      >
        {renderSubtree(column.components)}
      </div>
    ))}
  </div>
);

export default WebformPreview;
