import DOMPurify, {Config} from 'dompurify';

const OPTIONS: Config = {
  ALLOWED_TAGS: ['sub', 'sup'],
  ALLOWED_ATTR: [],
};

export interface AffixProps {
  children: string;
}

const Affix: React.FC<JSX.IntrinsicElements['span'] & AffixProps> = ({children, ...props}) => {
  const sanitizedContent = DOMPurify.sanitize(children, OPTIONS);
  return <span {...props} dangerouslySetInnerHTML={{__html: sanitizedContent}} />;
};

export default Affix;
