import { As } from './as';
import { IsAny } from './types';

export type MatchFieldSelector = true;

export type FieldSelector = MatchFieldSelector | false | undefined | null;

export type Selector<T> =
  IsAny<T> extends true
    ? FieldSelector
    : T extends (args: infer Args) => infer Result
      ? undefined extends Args
        ? {
            __args?: Args;
          } & Selector<Result>
        : {
            __args: Args;
          } & Selector<Result>
      : T extends any[]
        ? Selector<T[number]>
        : T extends object
          ? {
              [K in keyof T]?: Selector<T[K]> | As<string, Selector<T[K]>>;
            } & {
              __scalar?: FieldSelector;
            }
          : FieldSelector;
