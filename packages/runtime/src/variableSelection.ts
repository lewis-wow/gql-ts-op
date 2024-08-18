import { As } from './as';
import { FieldsToRemove, Nil } from './fieldsSelection';
import { EmptyObject, Simplify } from './types';
import { Variable } from './variable';

export type VariableSelection<TOperation> = {
  __args: Simplify<Handle__args<TOperation>>;
  object: HandleObject<TOperation>;
  alias: TOperation extends As<string, infer AliasValue> ? VariableSelection<AliasValue> : never;
  never: {};
}[TOperation extends Nil
  ? 'never'
  : TOperation extends EmptyObject
    ? 'never'
    : TOperation extends { __args?: any }
      ? '__args'
      : TOperation extends As<string, any>
        ? 'alias'
        : TOperation extends {}
          ? 'object'
          : 'never'];

type HandleObject<TOperation> =
  Omit<TOperation, FieldsToRemove> extends EmptyObject
    ? {}
    : {
        [K in keyof Omit<TOperation, FieldsToRemove>]: VariableSelection<TOperation[K]>;
      }[keyof Omit<TOperation, FieldsToRemove>];

type Handle__args<TOperation> = TOperation extends { __args?: any }
  ? {
      [K in keyof TOperation['__args'] as TOperation['__args'][K] extends Variable<any, infer VariableName, boolean>
        ? VariableName
        : never]: TOperation['__args'][K] extends Variable<infer VariableType, string, boolean> ? VariableType : never;
    } & HandleObject<TOperation>
  : {};

type Test = VariableSelection<{
  tweet: {
    __args: {
      id: Variable<string, 'my_id', false>;
    };
    __scalar: true;
    createdAt: false;
  };
}>;
