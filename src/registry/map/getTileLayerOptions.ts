import type {Option} from '@/components/formio/select';

const getChildrenByTag = (layer: Element, childTag: string): Element[] => {
  return Array.from(layer.children).filter(
    child => child.tagName.toLowerCase() === childTag.toLowerCase()
  );
};

const getChildContent = (layer: Element, childTag: string) => {
  const directChildren = getChildrenByTag(layer, childTag);
  return directChildren.length ? directChildren[0].textContent : null;
};

const getOptionsFromWMSLayers = (layers: Element[], labelPrefix: string = ''): Option[] => {
  const layerOptions: Option[] = [];

  layers.forEach(layerElement => {
    const name = getChildContent(layerElement, 'Name');
    const label = getChildContent(layerElement, 'Title') || name;
    const labelWithPrefix = [labelPrefix, label].filter(part => !!part).join(' > ');
    let childLabelPrefix = labelPrefix;

    // If the layer has a name, then it has data to display.
    // See the OGC WMS implementation specifications below for more details.
    if (name) {
      layerOptions.push({
        value: name,
        label: labelWithPrefix,
      });
      childLabelPrefix = labelWithPrefix;
    }

    const children = getChildrenByTag(layerElement, 'Layer');
    if (children.length) {
      layerOptions.push(...getOptionsFromWMSLayers(children, childLabelPrefix));
    }
  });

  return layerOptions;
};

// See the OGC WMS implementation specifications for context about the WMS XML structure:
// https://portal.ogc.org/files/?artifact_id=14416&swpmtx=be9f07ca90dc0d45f9e5ff04f188b4e7&swpmtxnonce=72eb772a0b
export const getWMSLayerOptionsFromXMLData = (xmlContent: Document): Option[] => {
  // `topLayers` should always be 1 element, but just in case lets assume there could be
  // multiple.
  const topLayers = xmlContent.querySelectorAll('Capability > Layer');

  // If we cannot find the top layer, something is wrong.
  if (!topLayers.length) {
    return [];
  }
  return getOptionsFromWMSLayers(Array.from(topLayers));
};

export const getWMSLayerOptions = async (wmsTileLayerUrl: string): Promise<Option[]> => {
  if (!wmsTileLayerUrl) {
    return [];
  }

  const response = await window.fetch(wmsTileLayerUrl);
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/xml');
  return getWMSLayerOptionsFromXMLData(doc);
};
