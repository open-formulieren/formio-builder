interface DescriptionProps {
  text: string;
}

const Description: React.FC<DescriptionProps> = ({text}) => {
  if (!text) return null;
  return <div className="form-text text-muted">{text}</div>;
};

export default Description;
