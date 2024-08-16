interface ActionIconProps {
  icon: string;
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ActionIcon: React.FC<ActionIconProps> = ({icon, label, onClick}) => (
  <button type="button" onClick={onClick} className="offb-form-preview-action" title={label}>
    <i className={`fa fa-fw fa-${icon}`} aria-hidden="true" />
    <span className="sr-only">{label}</span>
  </button>
);

export default ActionIcon;
