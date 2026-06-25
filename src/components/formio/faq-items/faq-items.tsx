import type {FAQItem as FAQItemType} from '@open-formulieren/types';

import './faq-items.scss';

export interface FAQItemProps {
  faqItem: FAQItemType;
}

const FAQItem: React.FC<FAQItemProps> = ({faqItem}) => {
  return (
    <div className="faq-item">
      <i className="fa fa-question-circle text-muted" />
      <span>{` ${faqItem.label}`}</span>
    </div>
  );
};

export interface FAQItemsProps {
  items: FAQItemType[];
}

const FAQItems: React.FC<FAQItemsProps> = ({items}) => {
  return items.map((faqItem, index) => <FAQItem key={index} faqItem={faqItem} />);
};

export default FAQItems;
