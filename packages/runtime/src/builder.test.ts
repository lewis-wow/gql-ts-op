import { GeneratedSchema } from './__test__/schema.generated';
import { createGraphQLDocumentBuilder } from './builder';
import { ResultOf, VariablesOf } from '@graphql-typed-document-node/core';

const { query } = createGraphQLDocumentBuilder<GeneratedSchema>({
  generatedSchema: {},
});

const testQuery = query(($) => ({
  tweet: {
    __args: {
      id: $('id'),
    },
    __scalar: true,
  },
}));

type TestQueryResult = ResultOf<typeof testQuery>;
type TestQueryVariables = VariablesOf<typeof testQuery>;

type TestIdQueryResult = NonNullable<TestQueryResult['tweet']>;
