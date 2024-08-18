import { As } from './as';
import { Falsy, FieldsToRemove, Truthy } from './fieldsSelection';
import { EmptyObject, ObjectValues, Simplify } from './types';
import { Variable } from './variable';

export type VariableSelection<TOperation> = {
  __args: Simplify<Handle__args<TOperation>>;
  object: HandleObject<Omit<TOperation, FieldsToRemove>>;
  alias: TOperation extends As<string, infer AliasValue> ? VariableSelection<AliasValue> : never;
  never: {};
}[TOperation extends Truthy | Falsy
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

type HandleObject<TOperation> = ObjectValues<
  Pick<
    {
      [K in keyof TOperation]: VariableSelection<TOperation[K]>;
    },
    keyof {
      [K in keyof TOperation as TOperation[K] extends Truthy | Falsy ? never : K]: any;
    }
  >
>;

type Handle__args<TOperation> = TOperation extends { __args?: any }
  ? {
      [K in keyof TOperation['__args'] as TOperation['__args'][K] extends Variable<any, infer VariableName>
        ? VariableName
        : never]: TOperation['__args'][K] extends Variable<infer VariableType, string> ? VariableType : never;
    } & HandleObject<Omit<TOperation, FieldsToRemove>>
  : {};
