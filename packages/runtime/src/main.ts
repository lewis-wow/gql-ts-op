import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { Selector } from './selector';
import { ExtractResult } from './extractResult';
import { createVariablesProxy } from './createVariablesProxy';

export const createBuilder = <TSchema>() => {
  return {
    build: <const TSelect extends Selector<TSchema>, TVariables extends object = {}>(
      builder: (variables: TVariables) => TSelect
    ): TypedDocumentNode<TVariables, ExtractResult<TSelect, TSchema>> => {
      const result = builder(createVariablesProxy() as TVariables);

      // TODO
      console.log((result as any).query.Tweet);

      return null as any;
    },
  };
};
