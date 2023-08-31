import sanitizeHtml, {IOptions} from 'sanitize-html';

const OPTIONS: IOptions = {
  allowedTags: ['sub', 'sup'],
  allowedAttributes: {},
  allowedSchemes: [],
};

export interface AffixProps {
  children: string;
}

const Affix: React.FC<JSX.IntrinsicElements['span'] & AffixProps> = ({children, ...props}) => {
  const sanitizedContent = sanitizeHtml(children, OPTIONS);
  return <span {...props} dangerouslySetInnerHTML={{__html: sanitizedContent}} />;
};

export default Affix;
