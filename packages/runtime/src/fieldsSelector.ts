import { As } from './as';
import { Falsy, Truthy } from './fieldsSelection';
import { IsAny } from './types';

export type FieldsSelector<T> =
  IsAny<T> extends true
    ? Falsy | Truthy
    : T extends (args: infer Args) => infer Result
      ? (undefined extends Args
          ? {
              __args?: Args;
            }
          : {
              __args: Args;
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
