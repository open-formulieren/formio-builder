import clsx from 'clsx';
import type {PropsWithChildren} from 'react';

import './contentPlaceholder.scss';

interface ContentPlaceholderProps extends PropsWithChildren {
  variant: 'builder' | 'designer';
}

const Index: React.FC<ContentPlaceholderProps> = ({variant, children}) => (
  <div className={clsx('offb-content-placeholder', `offb-content-placeholder--${variant}`)}>
    {children}
  </div>
);

export default Index;
