import {css} from '@emotion/css';
import {ColumnsComponentSchema} from '@open-formulieren/types';
import clsx from 'clsx';
import {useState} from 'react';
import {FormattedMessage} from 'react-intl';

import {ComponentPreviewProps} from '../types';

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

// XXX: once we've moved away from bootstrap/formio 'component library', clean up the
// styles setup for preview and remove @emotion/css again.
const PREVIEW_GRID = css`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-column-gap: 10px;
  margin-block-start: 1em;

  background-size: 50px 50px;
  background-color: rgba(97, 137, 255, 0.27);
  background-image: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.04) 25%,
    transparent 25%,
    transparent 50%,
    rgba(0, 0, 0, 0.04) 50%,
    rgba(0, 0, 0, 0.04) 75%,
    transparent 75%,
    transparent
  );
`;

const PREVIEW_GRID_MOBILE = css`
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 10px;
  grid-row-gap: 14px;
  margin-block-start: 1em;
  max-inline-size: 50%;
  margin-inline: auto;
`;

const COL_PREVIEW = css`
  background-color: var(--col-preview-background-color, #eee);
  padding-inline: 5px;
  padding-block: 10px;
  margin-block: -2px;
  hyphens: auto;
  border: solid 1px var(--col-preview-border-color, #ccc);
  border-radius: 2px;
  text-align: center;
  grid-column: span var(--_col-preview-span);
`;

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

      <div className={clsx(PREVIEW_GRID, {[PREVIEW_GRID_MOBILE]: isMobile})}>
        {columns.map((column, index) => (
          <div
            key={`column-${index}`}
            className={COL_PREVIEW}
            style={
              {
                '--_col-preview-span': `${isMobile ? column.sizeMobile : column.size}`,
              } as React.CSSProperties
            }
          >
            <FormattedMessage
              description="Column preview column description"
              defaultMessage="Column {number}/{total}"
              values={{
                number: index + 1,
                total: columns.length,
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Preview;
