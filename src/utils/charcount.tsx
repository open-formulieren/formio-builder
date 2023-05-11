import {FormattedMessage} from 'react-intl';

export interface CharCountProps {
  value: string;
}

const CharCount: React.FC<CharCountProps> = ({value}) => (
  <span className="text-muted">
    <FormattedMessage
      description="Character count"
      defaultMessage="{length} {length, plural, one {character} other {characters}}"
      values={{length: value.length}}
    />
  </span>
);

export default CharCount;
