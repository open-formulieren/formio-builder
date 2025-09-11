import clsx from 'clsx';
import {uniqueId} from 'lodash';
import React, {useRef, useState} from 'react';
import {useIntl} from 'react-intl';

import './panel.scss';
import Tooltip from './tooltip';

export interface PanelProps {
  title: React.ReactNode;
  tooltip?: string;
  collapsible?: boolean;
  initialCollapsed?: boolean;
  headerEnd?: React.ReactNode;
  children?: React.ReactNode;
}

interface HeaderProps extends HTMLDivElement {
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  ['aria-expanded']: 'true' | 'false';
  ['aria-controls']: string;
}

const Panel: React.FC<PanelProps> = ({
  title,
  tooltip = '',
  collapsible = false,
  initialCollapsed = false,
  headerEnd,
  children,
}) => {
  const intl = useIntl();
  const idRef = useRef(uniqueId('panel_body'));
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  if (!collapsible && collapsed) {
    setCollapsed(false);
  }

  const headerProps: HeaderProps | {} = collapsible
    ? {
        onClick: () => setCollapsed(!collapsed),
        role: 'button',
        ['aria-expanded']: collapsed ? 'false' : 'true',
        ['aria-controls']: idRef.current,
      }
    : {};

  const collapseTitle = intl.formatMessage(
    {
      description: 'Panel expand/collapse title',
      defaultMessage: `{collapsed, select,
      true {Expand panel}
      other {Collapse panel}
    }`,
    },
    {collapsed}
  );

  return (
    <div className="mb-2 card border">
      <div
        className={clsx('card-header', 'bg-default', {
          'd-flex': !!headerEnd,
          'align-items-center': !!headerEnd,
        })}
      >
        <div className="offb-panel-header-collapse-trigger" {...headerProps}>
          <span className="mb-0 card-title">
            {collapsible ? (
              <i
                className={clsx('formio-collapse-icon', 'text-muted', 'fa', 'fa-regular', {
                  'fa-plus-square': collapsed,
                  'fa-minus-square': !collapsed,
                })}
                title={collapseTitle}
              />
            ) : null}
            {title}
            {tooltip && ' '}
            <Tooltip text={tooltip} />
          </span>
        </div>

        {headerEnd}
      </div>
      {collapsed ? null : (
        <div className="card-body" id={idRef.current}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Panel;
