// TODO: move into its own library!
import {useReducer} from 'react';

interface Message {
  originalDefault: string; // default from code
  defaultMessage: string; // translation
  description: string;
  isTranslated?: boolean;
}

type MessageCatalog = Record<string, Message>;

const reducer = ({type, action}): MessageCatalog => {
  return {};
};

const TranslationsManager: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, {});

  return (
    <div>
      <h1>Translations</h1>

      <div>
        <textarea
          name="sourceFile"
          placeholder="Paste the translations JSON file contents here"
          style={{inlineSize: '100%'}}
        />
      </div>
    </div>
  );
};

export default TranslationsManager;
