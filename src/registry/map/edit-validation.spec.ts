import {MapComponentSchema} from '@open-formulieren/types';

import {dummyBuilderContext, dummyIntl} from '@/tests/test-utils';

import schemaFactory from './edit-validation';

test.each([
  [{lat: 52.083333, lng: 4.333333}, true], // lat & lng in bounds
  [{lat: 52.083333, lng: 9.333333}, false], // lng out of bounds
  [{lat: 65.083333, lng: 4.333333}, false], // lat out of bounds
  [{lat: 65.083333, lng: 9.333333}, false], // lat & lng out of bounds
])('A formio Map component with initialCenter %s (expected %s)', (coordinates, expectedResult) => {
  const schema = schemaFactory({intl: dummyIntl, builderContext: dummyBuilderContext});
  const component: MapComponentSchema = {
    type: 'map',
    key: 'map',
    label: 'Map',
    id: 'map',
    useConfigDefaultMapSettings: false,
    initialCenter: coordinates,
  };

  const {success} = schema.safeParse(component);
  expect(success).toBe(expectedResult);
});
