interface JSONPreviewProps {
  data: unknown; // JSON.stringify first argument has the 'any' type in TS itself...
  className?: string;
}

const JSONPreview: React.FC<JSONPreviewProps & JSX.IntrinsicElements['pre']> = ({
  data,
  className = 'card',
  ...props
}) => (
  <pre className={className} data-testid="jsonPreview" {...props}>
    {JSON.stringify(data, null, 2)}
  </pre>
);

export default JSONPreview;
