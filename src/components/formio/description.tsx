import './description.scss';

interface DescriptionProps {
  text: React.ReactNode;
}

const Description: React.FC<DescriptionProps> = ({text}) => {
  if (!text) return null;
  return <div className="form-text form-text--description text-muted">{text}</div>;
};

export default Description;
