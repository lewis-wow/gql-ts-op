import { PluginFunction } from '@graphql-codegen/plugin-helpers';
import { GraphQLSchema } from 'graphql';
import { generate } from './generate';

export const plugin: PluginFunction = async (schema: GraphQLSchema) => {
  const { schemaCode } = await generate(schema);

  return schemaCode;
};
