import {clsx} from 'clsx';

export interface ComponentIconProps {
  icon: string;
}

const ComponentIcon: React.FC<ComponentIconProps> = ({icon}) => (
  <i
    className={clsx('fa', `fa-${icon}`, 'mr-2', {
      far: ['id-card', 'dot-circle', 'clock', 'calendar-days'].includes(icon),
      'fa-brands': ['html5'].includes(icon),
    })}
    aria-hidden="true"
  />
);

export default ComponentIcon;
