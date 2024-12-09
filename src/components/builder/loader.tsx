import {FormattedMessage} from 'react-intl';

const Loader: React.FC = () => {
  return (
    <div className="spinner-border text-primary" role="status">
      <span className="sr-only">
        <FormattedMessage description="Loading content text" defaultMessage="Loading..." />
      </span>
    </div>
  );
};

export default Loader;
