import {useDeferredValue, useMemo, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import type {NormalizedComponentGroups} from '@/components/designer/types';

import ComponentsGroup from './ComponentsGroup';
import './ComponentsList.scss';
import {FORM_DESIGNER_GROUPS, FORM_DESIGNER_GROUP_LABELS, FORM_DESIGNER_PRESETS} from './constants';
import {normalizeComponentConfiguration} from './normalizeComponentConfiguration';

const ComponentsList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const deferredQuery = useDeferredValue(searchQuery);

  const intl = useIntl();
  const isSearching = deferredQuery !== '';

  const normalizedComponentGroups: NormalizedComponentGroups[] = useMemo(() => {
    // Sort the groups by weight and normalize the components in each group.
    const normalizedGroups: NormalizedComponentGroups[] = FORM_DESIGNER_GROUPS.map(group => ({
      groupName: group.name,
      components: normalizeComponentConfiguration(group, intl),
    }));

    // Add the preset group as last.
    normalizedGroups.push({
      groupName: 'preset',
      components: FORM_DESIGNER_PRESETS,
    });
    return normalizedGroups;
  }, [intl]);

  const filteredComponentGroups = useMemo<NormalizedComponentGroups[]>(() => {
    // If not searching, return the normalizedComponentGroups as-is.
    if (!isSearching) return normalizedComponentGroups;

    // Filter the normalizedComponentGroups based on the search query.
    return normalizedComponentGroups.map(({groupName, components}) => ({
      groupName,
      components: components.filter(componentDefinition => {
        const searchTerms = [
          componentDefinition.key.toLowerCase(),
          componentDefinition.label.toLowerCase(),
        ];
        return searchTerms.some(term => term.includes(deferredQuery.toLowerCase()));
      }),
    }));
  }, [isSearching, deferredQuery, normalizedComponentGroups]);

  const hasSearchResults = filteredComponentGroups.some(({components}) => components.length > 0);
  const noSearchResultsMessageId = 'no-search-results';

  return (
    <div className="offb-components-list">
      <input
        className="form-control offb-components-list__search-input"
        type="search"
        placeholder={intl.formatMessage({
          description: 'Components list search input placeholder',
          defaultMessage: 'Search component(s)',
        })}
        value={searchQuery}
        onChange={event => setSearchQuery(event.target.value)}
        aria-label={intl.formatMessage({
          description: 'Components list search input accessible label',
          defaultMessage: 'Search component(s)',
        })}
        aria-describedby={!hasSearchResults ? noSearchResultsMessageId : undefined}
      />

      {hasSearchResults ? (
        filteredComponentGroups.map(({groupName, components}, index) => (
          <ComponentsGroup
            key={index}
            isSearching={isSearching}
            isDefault={index === 0}
            testId={`component-group--${groupName}`}
            title={<FormattedMessage {...FORM_DESIGNER_GROUP_LABELS[groupName]} />}
            componentConfigurations={components}
          />
        ))
      ) : (
        <p className="text-muted" id={noSearchResultsMessageId}>
          <FormattedMessage
            description="Components list 'no results found' message"
            defaultMessage="No matching components found."
          />
        </p>
      )}
    </div>
  );
};

export default ComponentsList;
