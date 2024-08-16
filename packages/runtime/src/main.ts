import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { Selector } from './selector';
import { createVariablesProxy } from './variable';
import { FieldsSelection } from './fieldsSelection';

export const createBuilder = <TSchema>() => {
  return {
    build: <const TSelect extends Selector<TSchema>, TVariables extends object = {}>(
      builder: (variables: TVariables) => TSelect
    ): TypedDocumentNode<TVariables, FieldsSelection<TSchema, TSelect>> => {
      const result = builder(createVariablesProxy() as TVariables);

      // TODO
      return result as any;
    },
  };
};
