import {default as PrefillAttributeSelect} from './attribute';
import {default as PrefillIdentifierRoleSelect} from './identifierRole';
import {default as PrefillPluginSelect} from './plugin';

export * from './types';

export const PrefillConfiguration: React.FC = () => (
  <>
    <PrefillPluginSelect />
    <PrefillAttributeSelect />
    <PrefillIdentifierRoleSelect />
  </>
);
