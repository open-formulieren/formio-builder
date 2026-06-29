import clsx from 'clsx';
import type {PropsWithChildren} from 'react';

import './ContentPlaceholder.scss';

interface ContentPlaceholderProps extends PropsWithChildren {
  variant: 'builder' | 'designer';
  testId?: string;
}

const ContentPlaceholder: React.FC<ContentPlaceholderProps> = ({variant, testId, children}) => (
  <div
    className={clsx('offb-content-placeholder', `offb-content-placeholder--${variant}`)}
    data-testid={testId}
  >
    {children}
  </div>
);

export default ContentPlaceholder;
