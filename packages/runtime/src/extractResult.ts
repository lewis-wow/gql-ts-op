import { IsAny } from './types';

export type ExtractResult<TOperationDefinition, TSchema> =
  IsAny<TSchema> extends true
    ? TSchema
    : TSchema extends (args: any) => infer Result
      ? ExtractResult<TOperationDefinition, Result>
      : TSchema extends object
        ? {
            [K in keyof Omit<TOperationDefinition, '__args' | '__as'> as TOperationDefinition[K] extends object
              ? TOperationDefinition[K] extends { __as: string }
                ? TOperationDefinition[K]['__as']
                : K
              : TOperationDefinition[K] extends true
                ? K
                : never]: K extends keyof TSchema ? ExtractResult<TOperationDefinition[K], TSchema[K]> : never;
          }
        : TSchema;

/*
type Test = ExtractResult<
  {
    tweet: {
      __args: {
        id: string;
      };
      date: true;
      id: false;
      author: As<
        'my_author',
        {
          id: true;
          name: 'author_name';
        }
      >;
    };
  },
  {
    tweet: (args: { id: string }) => {
      id: string;
      date: any;
      author: (args?: { filter?: { name?: string } }) => {
        name: string;
        id: string;
        age: number;
      };
    };
  }
>;
*/
