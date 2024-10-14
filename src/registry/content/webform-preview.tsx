import type {ContentComponentSchema} from '@open-formulieren/types';

import type {WebformPreviewProps} from '@/registry/types';

const WebformPreview: React.FC<WebformPreviewProps<ContentComponentSchema>> = ({
  component: {html},
}) => <div dangerouslySetInnerHTML={{__html: html}} />;

export default WebformPreview;
