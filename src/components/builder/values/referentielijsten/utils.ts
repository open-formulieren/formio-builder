import {IntlShape} from 'react-intl';

import {
  ReferentielijstenTabelItem,
  ReferentielijstenTabelOption,
} from '@/components/builder/values/referentielijsten/types';

// Transform options to the desired shape for the options of the Select component
export function transformItems(
  items: ReferentielijstenTabelItem[] | ReferentielijstenTabelOption[],
  intl: IntlShape
) {
  return items.map(item => {
    const {code, naam, isGeldig} = item;
    return {
      value: code,
      label: intl.formatMessage(
        {
          description: 'Label for referentielijsten table or item',
          defaultMessage: '{naam}{isValid, select, true {} other { (no longer valid)}}',
        },
        {naam: naam, isValid: isGeldig}
      ),
    };
  });
}
