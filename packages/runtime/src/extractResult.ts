import { As } from './as';
import { ErrorMessage, IsAny, Primitive } from './types';

export type ExtractResult<TOperationDefinition, TSchema> =
  IsAny<TSchema> extends true
    ? TSchema
    : TSchema extends (args: any) => infer Result
      ? ExtractResult<TOperationDefinition, Result>
      : TSchema extends any[]
        ? ExtractResult<TOperationDefinition, TSchema[number]>[]
        : TSchema extends object
          ? TOperationDefinition extends { __scalar: true }
            ? {
                [K in keyof TSchema as K extends keyof TOperationDefinition
                  ? TOperationDefinition[K] extends true
                    ? K
                    : never
                  : TSchema[K] extends Primitive
                    ? K
                    : never]: TSchema[K];
              } & ExtractResult<Omit<TOperationDefinition, '__scalar'>, TSchema>
            : {
                [K in keyof Omit<TOperationDefinition, '__args' | '__as'> as TOperationDefinition[K] extends object
                  ? TOperationDefinition[K] extends As<infer AliasName, infer AliasValue>
                    ? AliasValue extends object | true
                      ? AliasName
                      : never
                    : K
                  : TOperationDefinition[K] extends true
                    ? K
                    : never]: K extends keyof TSchema
                  ? ExtractResult<
                      TOperationDefinition[K] extends As<any, infer AliasValue> ? AliasValue : TOperationDefinition[K],
                      TSchema[K]
                    >
                  : ErrorMessage<'Operation defintion key does not exists in Schema'>;
              }
          : TSchema;

type Test = ExtractResult<
  {
    tweet: {
      __args: {
        id: string;
      };
      __scalar: true;
      author: {
        id: true;
        name: 'author_name';
      };
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
      }[];
    };
  }
>;

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
