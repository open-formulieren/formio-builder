import type {FAQItem as FAQItemType} from '@open-formulieren/types';

import './faq-items.scss';

interface FAQItemProps {
  label: string;
}

const FAQItem: React.FC<FAQItemProps> = ({label}) => {
  return (
    <div className="faq-item-preview">
      <i className="fa fa-question-circle text-muted" />
      <span>{` ${label}`}</span>
    </div>
  );
};

interface FAQItemsProps {
  items: FAQItemType[];
}

const FAQItems: React.FC<FAQItemsProps> = ({items}) => {
  return items.map((faqItem, index) => <FAQItem key={index} label={faqItem.label} />);
};

export default FAQItems;
