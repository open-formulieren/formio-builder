import clsx from 'clsx';
import {FormattedMessage} from 'react-intl';

import {DraggableMenuItem} from '@/components/designer/dragDrop';
import type {NormalizedComponentConfiguration} from '@/components/designer/types';

import './ComponentsGroup.scss';

interface ComponentsGroupProps {
  testId: string;
  isSearching?: boolean;
  isDefault?: boolean;
  title: React.ReactNode;
  componentConfigurations: NormalizedComponentConfiguration[];
}

/**
 * Component for rendering a group of components.
 *
 * This component is responsible for rendering a group of components and (future)
 * drag-and-drop behaviour.
 */
const ComponentsGroup: React.FC<ComponentsGroupProps> = ({
  testId,
  isSearching,
  isDefault,
  title,
  componentConfigurations,
}) => {
  if (componentConfigurations.length === 0) return null;

  return (
    <details
      // Allowing multiple groups to be open at the same time when searching.
      name={isSearching ? undefined : 'component-group'}
      open={isSearching || isDefault}
      className="offb-component-group card border"
      data-testid={testId}
    >
      <summary className="card-header bg-default">
        <span className="card-title">{title}</span>
      </summary>

      <div className="card-body p-2">
        <ul className="list-unstyled mb-0">
          {componentConfigurations.map((component, index) => (
            <li key={`${component.schema.key}-${component.schema.type}-${index}`}>
              <DraggableMenuItem type={component.schema.type}>
                <span
                  className={clsx(
                    'btn',
                    'btn-outline-primary',
                    'btn-block',
                    'btn-sm',
                    'text-left',
                    'border-0',
                    'offb-component-group__component-button'
                  )}
                >
                  <i className={clsx('fa', `fa-${component.icon}`, 'mr-2')} aria-hidden="true" />
                  {component.label}
                  {component.isDeprecated && (
                    <span className="badge badge-warning ml-2">
                      <i className="fa fa-triangle-exclamation" aria-hidden="true" />{' '}
                      <FormattedMessage
                        description="Deprecated component label"
                        defaultMessage="Deprecated"
                      />
                    </span>
                  )}
                </span>
              </DraggableMenuItem>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
};

export default ComponentsGroup;
