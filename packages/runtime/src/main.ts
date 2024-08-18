import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { FieldsSelector } from './fieldsSelector';
import { FieldsSelection } from './fieldsSelection';
import { $variable } from './variable';
import { VariableSelection } from './variableSelection';

export type BuilderFn<TSchemaOperation, TSelect> = undefined extends TSchemaOperation
  ? undefined
  : ($: typeof $variable) => TSelect;

export class GQLBuilder<TSchema extends { query?: any; mutation?: any; subscription?: any }> {
  query<const TSelect extends FieldsSelector<TSchema['query']>, TVariables extends object = {}>(
    builderFn: BuilderFn<TSchema['query'], TSelect>
  ): TypedDocumentNode<VariableSelection<TSelect>, FieldsSelection<TSchema['query'], TSelect>> {
    const result = builderFn?.($variable);

    // TODO
    return result as any;
  }

  mutation<const TSelect extends FieldsSelector<TSchema['mutation']>, TVariables extends object = {}>(
    builderFn: undefined extends TSchema['mutation'] ? undefined : (variables: TVariables) => TSelect
  ): TypedDocumentNode<TVariables, FieldsSelection<TSchema['mutation'], TSelect>> {
    const result = builderFn?.($variable);

    // TODO
    return result as any;
  }

  subscription<const TSelect extends FieldsSelector<TSchema['subscription']>, TVariables extends object = {}>(
    builderFn: undefined extends TSchema['subscription'] ? undefined : (variables: TVariables) => TSelect
  ): TypedDocumentNode<TVariables, FieldsSelection<TSchema['subscription'], TSelect>> {
    const result = builderFn?.($variable);

    // TODO
    return result as any;
  }
}
