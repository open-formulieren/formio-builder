import {css} from '@emotion/css';
import {ColumnsComponentSchema} from '@open-formulieren/types';
import clsx from 'clsx';
import {useState} from 'react';
import {FormattedMessage} from 'react-intl';

import {ComponentPreviewProps} from '../types';

// XXX: once we've moved away from bootstrap/formio 'component library', clean up the
// styles setup for preview and remove @emotion/css again.

interface ViewportToggleProps {
  mobile: boolean;
  onChange: (isMobile: boolean) => void;
}

const ViewportToggle: React.FC<ViewportToggleProps> = ({mobile, onChange}) => {
  return (
    <div className="btn-group btn-group-toggle">
      <label className={clsx('btn', 'btn-sm', 'btn-light', {active: !mobile})}>
        <input
          type="radio"
          name="previewViewport"
          value="desktop"
          autoComplete="off"
          checked={!mobile}
          onChange={() => onChange(false)}
        />
        <FormattedMessage
          description="Columns 'desktop' preview viewport"
          defaultMessage="Default"
        />
      </label>
      <label className={clsx('btn', 'btn-sm', 'btn-light', {active: mobile})}>
        <input
          type="radio"
          name="previewViewport"
          value="mobile"
          autoComplete="off"
          checked={mobile}
          onChange={() => onChange(true)}
        />
        <FormattedMessage description="Columns 'mobile' preview viewport" defaultMessage="Mobile" />
      </label>
    </div>
  );
};

/**
 * Show a formio columns component preview.
 */
const Preview: React.FC<ComponentPreviewProps<ColumnsComponentSchema>> = ({component}) => {
  const [isMobile, setIsMobile] = useState(false);
  const {columns} = component;
  return (
    <>
      <div className="d-flex justify-content-end align-items-center">
        <ViewportToggle mobile={isMobile} onChange={newIsMobile => setIsMobile(newIsMobile)} />
      </div>
      Configured {columns.length} columns
    </>
  );
};

export default Preview;
