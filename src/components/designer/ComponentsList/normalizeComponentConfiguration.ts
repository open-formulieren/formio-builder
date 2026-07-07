import type {IntlShape} from 'react-intl';

import type {ComponentGroup, NormalizedComponentConfiguration} from '@/components/designer/types';
import {getRegistryEntry} from '@/registry';

/**
 * Normalize the component configurations for a given component group.
 */
export const normalizeComponentConfiguration = (group: ComponentGroup, intl: IntlShape) =>
  group.components.map<NormalizedComponentConfiguration>(componentType => {
    const {formDesigner, isDeprecated, builderInfo} = getRegistryEntry(componentType);

    return {
      key: componentType,
      label: intl.formatMessage(formDesigner.label),
      icon: builderInfo.icon,
      isDeprecated: isDeprecated,
      schema: builderInfo.schema,
    };
  });
