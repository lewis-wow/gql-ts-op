import { Alias } from './as';
import { IsAny, Primitive, SpecialSelectors } from './types';

export type ExtractResult<TOperationDefinition, TSchema> =
  IsAny<TSchema> extends true
    ? TSchema
    : TSchema extends (args: any) => infer Result
      ? ExtractResult<TOperationDefinition, Result>
      : TSchema extends object | any[]
        ? TOperationDefinition extends { __scalar: true }
          ? {
              [K in keyof TSchema as K extends keyof Omit<TOperationDefinition, SpecialSelectors>
                ? TOperationDefinition[K] extends object
                  ? TOperationDefinition[K] extends Alias<infer As, any>
                    ? As
                    : K
                  : TOperationDefinition[K] extends true
                    ? K
                    : never
                : TSchema[K] extends Primitive
                  ? K
                  : never]: TSchema[K];
            }
          : {
              [K in keyof Omit<TOperationDefinition, SpecialSelectors> as TOperationDefinition[K] extends object
                ? TOperationDefinition[K] extends Alias<infer As, any>
                  ? As
                  : K
                : TOperationDefinition[K] extends true
                  ? K
                  : never]: K extends keyof TSchema
                ? ExtractResult<
                    TOperationDefinition[K] extends Alias<any, infer AliasValue> ? AliasValue : TOperationDefinition[K],
                    TSchema[K]
                  >
                : never;
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

/*
type Test = ExtractResult<
  {
    tweet: {
      __args: {
        id: string;
      };
      __scalar: true;
      id: false;
      content: {
        __scalar: true;
      };
    };
  },
  {
    tweet: (args: { id: string }) => {
      id: string;
      number: number;
      content: {
        header: string;
        text: string;
        footer: string;
      };
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
