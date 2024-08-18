import { As } from './as';
import { Simplify } from './types';

export type FieldsSelection<TSchema, TOperationDefition> = {
  scalar: TSchema;
  union: Handle__isUnion<TSchema, TOperationDefition>;
  object: Simplify<HandleObject<TSchema, TOperationDefition>>;
  method: TSchema extends (args?: any) => any ? FieldsSelection<ReturnType<TSchema>, TOperationDefition> : never;
  array: TSchema extends Nil
    ? never
    : TSchema extends Array<infer T | null>
      ? Array<FieldsSelection<T, TOperationDefition>>
      : never;
  __scalar: Simplify<Handle__scalar<TSchema, TOperationDefition>>;
  never: never;
}[TOperationDefition extends Nil
  ? 'never'
  : TOperationDefition extends Falsy
    ? 'never'
    : TSchema extends Scalar
      ? 'scalar'
      : TSchema extends (args?: any) => any
        ? 'method'
        : TSchema extends any[]
          ? 'array'
          : TSchema extends { __isUnion?: any }
            ? 'union'
            : TOperationDefition extends { __scalar?: any }
              ? '__scalar'
              : TOperationDefition extends {}
                ? 'object'
                : 'never'];

type HandleObject<TSchema extends Anify<TOperation>, TOperation> = TOperation extends boolean
  ? TSchema
  : TSchema extends Nil
    ? never
    : Pick<
        {
          // using keyof TSchema to maintain ?: relations of TSchema type
          [K in keyof TSchema as K extends keyof TOperation
            ? TOperation[K] extends As<infer AliasName, any>
              ? AliasName
              : K
            : K]: K extends keyof TOperation
            ? TOperation[K] extends As<any, infer AliasValue>
              ? FieldsSelection<TSchema[K], NonNullable<AliasValue>>
              : FieldsSelection<TSchema[K], NonNullable<TOperation[K]>>
            : TSchema[K];
        },
        Exclude<
          keyof {
            [K in keyof TOperation as TOperation[K] extends As<infer AliasName, infer AliasValue>
              ? AliasValue extends Falsy
                ? never
                : AliasName
              : TOperation[K] extends Falsy
                ? never
                : K]: any;
          },
          FieldsToRemove
        >
      >;

type Handle__scalar<TSchema extends Anify<TOperation>, TOperation> = TSchema extends Nil
  ? never
  : Pick<
      // continue processing fields that are in TOperation, directly pass TSchema type if not in TOperation
      {
        [K in keyof TSchema as K extends keyof TOperation
          ? TOperation[K] extends As<infer AliasName, any>
            ? AliasName
            : K
          : K]: K extends keyof TOperation
          ? TOperation[K] extends As<string, infer AliasValue>
            ? FieldsSelection<TSchema[K], AliasValue>
            : FieldsSelection<TSchema[K], TOperation[K]>
          : TSchema[K];
      },
      // remove fields that are not scalars or are not in TOperation
      keyof {
        [K in keyof TSchema as TSchema[K] extends Nil
          ? never
          : K extends FieldsToRemove
            ? never
            : K extends keyof TOperation
              ? TOperation[K] extends As<infer AliasName, infer AliasValue>
                ? AliasValue extends Falsy
                  ? never
                  : AliasName
                : TOperation[K] extends Falsy
                  ? never
                  : K
              : TSchema[K] extends Scalar
                ? K
                : never]: any;
      }
    >;

type Handle__isUnion<TSchema extends Anify<TOperation>, TOperation> = TSchema extends Nil
  ? never
  : Omit<TSchema, FieldsToRemove>; // just return the union type

export type Scalar = string | number | Date | boolean | null | undefined;

export type Anify<T> = { [P in keyof T]?: any };

export type FieldsToRemove = '__isUnion' | '__scalar' | '__name' | '__args' | '__as';

export type Nil = undefined | null;
export type Falsy = false | 0 | null | undefined;
export type Truthy = 1 | true;
