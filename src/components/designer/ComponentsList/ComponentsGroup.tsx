import clsx from 'clsx';
import {FormattedMessage} from 'react-intl';

import type {NormalizedComponentDefinition} from '../types';
import './ComponentsGroup.scss';

interface ComponentsGroupProps {
  testId: string;
  isSearching?: boolean;
  isDefault?: boolean;
  title: React.ReactNode;
  componentDefinitions: NormalizedComponentDefinition[];
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
  componentDefinitions,
}) => {
  if (componentDefinitions.length === 0) return null;

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
          {componentDefinitions.map((component, index) => (
            <li key={`${component.schema.key}-${component.schema.type}-${index}`}>
              <button
                type="button"
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
              </button>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
};

export default ComponentsGroup;
