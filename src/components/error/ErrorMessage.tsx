const ALERT_MODIFIERS = ['info', 'warning', 'error', 'ok'] as const;

type ErrorMessageLevel = (typeof ALERT_MODIFIERS)[number];

const ALERT_STYLE_MODIFIERS: Record<ErrorMessageLevel, string> = {
  error: "alert-danger",
  info: "alert-info",
  warning: "alert-warning",
  ok: "alert-success",
};

const ICONS: Record<ErrorMessageLevel, React.ReactElement> = {
  error: <i className="fa fas fa-exclamation-circle" />,
  info: <i className="fa fas fa-info-circle" />,
  warning: <i className="fa fas fa-exclamation-triangle" />,
  ok: <i className="fa fas fa-check-circle" />,
};

const ARIA_TAGS: Record<
  ErrorMessageLevel,
  React.AriaAttributes & Pick<React.HTMLAttributes<HTMLDivElement>, 'role'>
> = {
  error: {role: 'alert'},
  warning: {role: 'alert'},
  info: {role: 'status', 'aria-live': 'polite'},
  ok: {role: 'status', 'aria-live': 'polite'},
};

export interface ErrorMessageProps {
  children?: React.ReactNode;
  level?: ErrorMessageLevel;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({children, level = 'error'}) => {
  if (!children) return null;
  return (
    <div className={`alert ${ALERT_STYLE_MODIFIERS[level]} d-flex align-items-center`} {...ARIA_TAGS[level]}>
      {ICONS[level]}
      <div className="ml-2">
        {children}
      </div>
    </div>
  );
};

export {ALERT_MODIFIERS};
export default ErrorMessage;
