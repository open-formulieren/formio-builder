import {SupportedLocales} from '@open-formulieren/types';
import type {FAQItem as FAQItemType} from '@open-formulieren/types/dist/common';
import React, {useContext} from 'react';

import {BuilderContext} from '@/context';

export interface FAQItemsProps {
  faqItem: FAQItemType;
}

const FAQItem: React.FC<FAQItemsProps> = ({faqItem}) => {
  const {supportedLanguageCodes} = useContext(BuilderContext);
  const labels: string[] = supportedLanguageCodes.reduce(
    (accumulator: string[], languageCode: SupportedLocales) => {
      const translations = faqItem?.openForms?.translations?.[languageCode];
      const label = translations?.label;

      if (!label) return accumulator;
      accumulator.push(label);
      return accumulator;
    },
    []
  );
  const selectedLabel = labels.length > 0 ? labels[0] : '';

  return (
    <div style={{paddingTop: '.375rem'}}>
      <i className="fa fa-question-circle text-muted" tabIndex={0} />
      <span>{` ${selectedLabel}`}</span>
    </div>
  );
};

export default FAQItem;
