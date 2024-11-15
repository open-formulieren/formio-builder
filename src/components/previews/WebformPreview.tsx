import {AnyComponentSchema} from '@open-formulieren/types';

import {getRegistryEntry} from '@/registry';

import NestedComponents from './NestedComponents';

export interface WebformPreviewProps {
  component: AnyComponentSchema;
}

const WebformPreview: React.FC<WebformPreviewProps> = ({component}) => {
  const entry = getRegistryEntry(component);
  const {webform: WebformPreview, panel: PanelPreview} = entry.preview;
  if (WebformPreview) {
    return (
      <WebformPreview
        component={component}
        renderSubtree={components => (
          <NestedComponents components={components} previewMode="webform" />
        )}
      />
    );
  }
  if (PanelPreview) return <PanelPreview component={component} />;
  return <>NO PREVIEW AVAILABLE FOR COMPONENT TYPE '{component.type}'</>;
};

export default WebformPreview;
