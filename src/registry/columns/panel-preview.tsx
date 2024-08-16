import {ColumnsComponentSchema} from '@open-formulieren/types';
import clsx from 'clsx';
import {useState} from 'react';
import {FormattedMessage} from 'react-intl';

import ModeToggle from '@/components/ModeToggle';

import {ComponentPreviewProps} from '../types';

type ViewportMode = 'desktop' | 'mobile';

/**
 * Show a formio columns component preview.
 */
const Preview: React.FC<ComponentPreviewProps<ColumnsComponentSchema>> = ({component}) => {
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');

  const {columns} = component;
  const isMobile = viewportMode === 'mobile';
  return (
    <>
      <div className="d-flex justify-content-end align-items-center">
        <ModeToggle<ViewportMode>
          name="previewViewport"
          currentMode={viewportMode}
          btnClassName="btn-light"
          onToggle={setViewportMode}
          modes={[
            {
              value: 'desktop',
              label: (
                <FormattedMessage
                  description="Columns 'desktop' preview viewport"
                  defaultMessage="Default"
                />
              ),
            },
            {
              value: 'mobile',
              label: (
                <FormattedMessage
                  description="Columns 'mobile' preview viewport"
                  defaultMessage="Mobile"
                />
              ),
            },
          ]}
        />
      </div>

      <div
        className={clsx('offb-columns-panel-preview', {
          'offb-columns-panel-preview--mobile': isMobile,
        })}
      >
        {columns.map((column, index) => (
          <div
            key={`column-${index}`}
            className="offb-columns-panel-preview__column"
            style={
              {
                '--_col-preview-span': `${isMobile ? column.sizeMobile : column.size}`,
              } as React.CSSProperties
            }
          >
            <FormattedMessage
              description="Column preview column description"
              defaultMessage="Column {number}"
              values={{
                number: index + 1,
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Preview;
