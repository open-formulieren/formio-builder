interface JSONPreviewProps {
  data: unknown; // JSON.stringify first argument has the 'any' type in TS itself...
  className?: string;
}

const JSONPreview: React.FC<JSONPreviewProps> = ({data, className = ''}) => (
  <pre className={className} data-testid="jsonPreview">
    {JSON.stringify(data, null, 2)}
  </pre>
);

export default JSONPreview;
