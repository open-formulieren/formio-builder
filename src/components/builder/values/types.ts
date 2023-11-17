import {AnyComponentSchema} from '@open-formulieren/types';

// Utility type to force distributive behaviour over AnyComponentSchema
type ExtractDataSrcValues<T> = T extends {openForms: {dataSrc: infer U}} ? U : never;

export type OptionValue = ExtractDataSrcValues<AnyComponentSchema>;

type FilterSchemasWithDataSrc<T> = T extends {openForms: {dataSrc: OptionValue}} ? T : never;

export type SchemaWithDataSrc = FilterSchemasWithDataSrc<AnyComponentSchema>;
