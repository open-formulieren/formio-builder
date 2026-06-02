import clsx from 'clsx';
import type {PropsWithChildren} from 'react';

import './ContentPlaceholder.scss';

interface ContentPlaceholderProps extends PropsWithChildren {
  variant: 'builder' | 'designer';
}

const ContentPlaceholder: React.FC<ContentPlaceholderProps> = ({variant, children}) => (
  <div className={clsx('offb-content-placeholder', `offb-content-placeholder--${variant}`)}>
    {children}
  </div>
);

export default ContentPlaceholder;
