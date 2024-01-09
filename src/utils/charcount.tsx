import {FormattedMessage} from 'react-intl';

export interface CharCountProps {
  value: string;
  maxLength?: number;
}

const CharCount: React.FC<CharCountProps> = ({value, maxLength}) => {
  const hasMaxLength = maxLength !== undefined;

  const msg = hasMaxLength ? (
    <FormattedMessage
      description="Character count remaining"
      defaultMessage="{length} {length, plural, one {character remaining} other {characters remaining}}"
      values={{length: maxLength - value.length}}
    />
  ) : (
    <FormattedMessage
      description="Character count"
      defaultMessage="{length} {length, plural, one {character} other {characters}}"
      values={{length: value.length}}
    />
  );
  return <span className="text-muted">{msg}</span>;
};

export default CharCount;
