import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { FieldsSelector } from './fieldsSelector';
import { FieldsSelection } from './fieldsSelection';
import { $variable } from './variable';
import { VariableSelection } from './variableSelection';
import { EmptyObject } from './types';

export type BuilderFn<TSelect> = ($: typeof $variable) => TSelect;

type RootTypeKeyWrapper<TSchema, TKey extends string> = TKey extends keyof TSchema ? TSchema[TKey] : EmptyObject;

export type CreateGraphQLDocumentBuilderArgs = {
  generatedSchema: object;
};

export const createGraphQLDocumentBuilder = <TSchema extends {}>({
  generatedSchema,
}: CreateGraphQLDocumentBuilderArgs) => {
  return {
    query: <TSelect extends FieldsSelector<RootTypeKeyWrapper<TSchema, 'query'>>>(
      builderFn: BuilderFn<TSelect>
    ): TypedDocumentNode<
      FieldsSelection<RootTypeKeyWrapper<TSchema, 'query'>, TSelect>,
      VariableSelection<TSelect>
    > => {
      const result = builderFn?.($variable);

      // TODO
      return result as any;
    },

    mutation: <TSelect extends FieldsSelector<RootTypeKeyWrapper<TSchema, 'mutation'>>>(
      builderFn: BuilderFn<TSelect>
    ): TypedDocumentNode<
      FieldsSelection<RootTypeKeyWrapper<TSchema, 'mutation'>, TSelect>,
      VariableSelection<TSelect>
    > => {
      const result = builderFn?.($variable);

      // TODO
      return result as any;
    },

    subscription: <TSelect extends FieldsSelector<RootTypeKeyWrapper<TSchema, 'subscription'>>>(
      builderFn: BuilderFn<TSelect>
    ): TypedDocumentNode<
      FieldsSelection<RootTypeKeyWrapper<TSchema, 'subscription'>, TSelect>,
      VariableSelection<TSelect>
    > => {
      const result = builderFn?.($variable);

      // TODO
      return result as any;
    },
  };
};
