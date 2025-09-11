import {expect} from '@storybook/test';

import {getWMSLayerOptionsFromXMLData} from '@/registry/map/getTileLayerOptions';

const wmsXmlContent = `<Capability><Layer><Title>Label</Title><Name>Identifier</Name></Layer></Capability>`;
const wmsXmlContentWithoutIdentifier = `<Capability><Layer><Title>Label</Title></Layer></Capability>`;
const wmsXmlContentWithChildren = `<Capability>
    <Layer>
      <Title>Parent</Title><Name>Identifier</Name>
      <Layer><Title>Child 1</Title><Name>Child 1 identifier</Name></Layer>
      <Layer><Title>Child 2</Title><Name>Child 2 identifier</Name></Layer>
    </Layer>
  </Capability>`;
const wmsXmlContentWithoutIdentifierWithChildren = `<Capability>
    <Layer>
      <Title>Parent</Title>
      <Layer><Title>Child 1</Title><Name>Child 1 identifier</Name></Layer>
      <Layer><Title>Child 2</Title><Name>Child 2 identifier</Name></Layer>
    </Layer>
  </Capability>`;
const wmsXmlContentWithGrandchildren = `<Capability>
    <Layer>
      <Title>Parent</Title><Name>Parent identifier</Name>
      <Layer>
        <Title>Child 1</Title><Name>Child 1 identifier</Name>
        <Layer>
          <Title>Grandchild 1</Title><Name>Grandchild 1 identifier</Name>
        </Layer>
      </Layer>
    </Layer>
  </Capability>`;

test('Parsing xml parent with identifier, without children', () => {
  const parser = new DOMParser();
  const document = parser.parseFromString(wmsXmlContent, 'text/xml');

  const options = getWMSLayerOptionsFromXMLData(document);

  expect(options).toHaveLength(1);
  expect(options[0]).toEqual({
    value: 'Identifier',
    label: 'Label',
  });
});
test('Parsing xml parent with identifier, with children', () => {
  const parser = new DOMParser();
  const document = parser.parseFromString(wmsXmlContentWithChildren, 'text/xml');

  const options = getWMSLayerOptionsFromXMLData(document);

  expect(options).toHaveLength(3);
  expect(options).toEqual([
    {
      value: 'Identifier',
      label: 'Parent',
    },
    {
      value: 'Child 1 identifier',
      label: 'Parent > Child 1',
    },
    {
      value: 'Child 2 identifier',
      label: 'Parent > Child 2',
    },
  ]);
});
test('Parsing xml parent without identifier, without children', () => {
  const parser = new DOMParser();
  const document = parser.parseFromString(wmsXmlContentWithoutIdentifier, 'text/xml');

  const options = getWMSLayerOptionsFromXMLData(document);

  expect(options).toHaveLength(0);
});
test('Parsing xml parent without identifier, with children', () => {
  const parser = new DOMParser();
  const document = parser.parseFromString(wmsXmlContentWithoutIdentifierWithChildren, 'text/xml');

  const options = getWMSLayerOptionsFromXMLData(document);

  expect(options).toHaveLength(2);
  expect(options).toEqual([
    {
      value: 'Child 1 identifier',
      label: 'Child 1',
    },
    {
      value: 'Child 2 identifier',
      label: 'Child 2',
    },
  ]);
});
test('Parsing xml parent with grandchildren', () => {
  const parser = new DOMParser();
  const document = parser.parseFromString(wmsXmlContentWithGrandchildren, 'text/xml');

  const options = getWMSLayerOptionsFromXMLData(document);

  expect(options).toHaveLength(3);
  expect(options).toEqual([
    {
      value: 'Parent identifier',
      label: 'Parent',
    },
    {
      value: 'Child 1 identifier',
      label: 'Parent > Child 1',
    },
    {
      value: 'Grandchild 1 identifier',
      label: 'Parent > Child 1 > Grandchild 1',
    },
  ]);
});
