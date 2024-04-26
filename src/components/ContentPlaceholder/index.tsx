import type {PropsWithChildren} from 'react';

import './contentPlaceholder.scss';

const ContentPlaceholder: React.FC<PropsWithChildren> = ({children}) => (
  <div className="offb-content-placeholder">{children}</div>
);

export default ContentPlaceholder;
