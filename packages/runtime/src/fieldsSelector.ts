import { As } from './as';
import { Falsy, Truthy } from './fieldsSelection';
import { IsAny } from './types';
import { Variable } from './variable';

export type FieldsSelector<T> =
  IsAny<T> extends true
    ? Falsy | Truthy
    : T extends (args: infer Args) => infer Result
      ? (undefined extends Args
          ? {
              __args?: { [K in keyof Args]: Variable<Args[K], string, boolean> };
            }
          : {
              __args: { [K in keyof Args]: Variable<Args[K], string, boolean> };
            }) &
          FieldsSelector<Result>
      : T extends any[]
        ? FieldsSelector<T[number]>
        : T extends object
          ? {
              [K in keyof T]?: FieldsSelector<T[K]> | As<string, FieldsSelector<T[K]>>;
            } & {
              __scalar?: Falsy | Truthy;
            }
          : Falsy | Truthy;
