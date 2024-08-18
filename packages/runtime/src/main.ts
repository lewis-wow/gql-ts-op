import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { FieldsSelector } from './fieldsSelector';
import { FieldsSelection } from './fieldsSelection';
import { $variable } from './variable';
import { VariableSelection } from './variableSelection';
import { EmptyObject } from './types';

export type BuilderFn<TSelect> = ($: typeof $variable) => TSelect;

type RootTypeKeyWrapper<TSchema, TKey extends string> = TKey extends keyof TSchema ? TSchema[TKey] : EmptyObject;

export class GQLBuilder<TSchema extends {}> {
  query<TSelect extends FieldsSelector<RootTypeKeyWrapper<TSchema, 'query'>>>(
    builderFn: BuilderFn<TSelect>
  ): TypedDocumentNode<VariableSelection<TSelect>, FieldsSelection<RootTypeKeyWrapper<TSchema, 'query'>, TSelect>> {
    const result = builderFn?.($variable);

    // TODO
    return result as any;
  }

  mutation<TSelect extends FieldsSelector<RootTypeKeyWrapper<TSchema, 'mutation'>>>(
    builderFn: BuilderFn<TSelect>
  ): TypedDocumentNode<VariableSelection<TSelect>, FieldsSelection<RootTypeKeyWrapper<TSchema, 'mutation'>, TSelect>> {
    const result = builderFn?.($variable);

    // TODO
    return result as any;
  }

  subscription<TSelect extends FieldsSelector<RootTypeKeyWrapper<TSchema, 'subscription'>>>(
    builderFn: BuilderFn<TSelect>
  ): TypedDocumentNode<
    VariableSelection<TSelect>,
    FieldsSelection<RootTypeKeyWrapper<TSchema, 'subscription'>, TSelect>
  > {
    const result = builderFn?.($variable);

    // TODO
    return result as any;
  }
}
