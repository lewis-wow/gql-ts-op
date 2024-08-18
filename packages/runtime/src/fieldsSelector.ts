import { As } from './as';
import { Falsy, Scalar, Truthy } from './fieldsSelection';
import { IsAny } from './types';
import { Variable } from './variable';

export type FieldsSelector<T> = {
  method: T extends (args: infer Args) => infer Result
    ? (undefined extends Args
        ? {
            __args?: { [K in keyof Args]: Variable<Args[K], string> };
          }
        : {
            __args: { [K in keyof Args]: Variable<Args[K], string> };
          }) &
        FieldsSelector<Result>
    : never;
  array: T extends any[] ? FieldsSelector<T[number]> : never;
  object: {
    [K in keyof T]?: FieldsSelector<T[K]> | As<string, FieldsSelector<T[K]>>;
  } & {
    __scalar?: Falsy | Truthy;
  };
  never: Record<string, never>;
  any: Falsy | Truthy;
  scalar: Falsy | Truthy;
}[IsAny<T> extends true
  ? 'any'
  : undefined extends T
    ? 'never'
    : unknown extends T
      ? 'never'
      : T extends (args?: any) => any
        ? 'method'
        : T extends any[]
          ? 'array'
          : T extends Scalar
            ? 'scalar'
            : T extends {}
              ? 'object'
              : 'never'];
