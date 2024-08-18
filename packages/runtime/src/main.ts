import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { FieldsSelector } from './fieldsSelector';
import { createVariablesProxy } from './variable';
import { FieldsSelection } from './fieldsSelection';

export class GQLBuilder<TSchema extends { query?: any; mutation?: any; subscription?: any }> {
  query<const TSelect extends FieldsSelector<TSchema['query']>, TVariables extends object = {}>(
    builderFn: (variables: TVariables) => TSelect
  ): TypedDocumentNode<TVariables, FieldsSelection<TSchema['query'], TSelect>> {
    const result = builderFn(createVariablesProxy() as TVariables);

    // TODO
    return result as any;
  }

  mutation<const TSelect extends FieldsSelector<TSchema['mutation']>, TVariables extends object = {}>(
    builderFn: (variables: TVariables) => TSelect
  ): TypedDocumentNode<TVariables, FieldsSelection<TSchema['mutation'], TSelect>> {
    const result = builderFn(createVariablesProxy() as TVariables);

    // TODO
    return result as any;
  }

  subscription<const TSelect extends FieldsSelector<TSchema['subscription']>, TVariables extends object = {}>(
    builderFn: (variables: TVariables) => TSelect
  ): TypedDocumentNode<TVariables, FieldsSelection<TSchema['subscription'], TSelect>> {
    const result = builderFn(createVariablesProxy() as TVariables);

    // TODO
    return result as any;
  }
}
