import { ErrorMessage } from './types';

export type Variable<TType, TVariableName extends string, TIsRequired extends boolean> = {
  __variableName: TVariableName;
  __isRequired: TIsRequired;
  __isVariable: true;

  /**
   * TypeScript only property - no runtime
   */
  __type: TType;
};

type ValidVariableName<T extends string> = T extends ''
  ? ErrorMessage<'Variable name cannot be empty.'>
  : T extends `${infer S}!`
    ? S extends `${string}!`
      ? ErrorMessage<'Variable name cannot have more than one bang at the end of the name.'>
      : S extends `${string}!${string}`
        ? ErrorMessage<'Variable name cannot have bang symbol in the middle of the name.'>
        : T
    : T extends `${string}!${string}`
      ? ErrorMessage<'Variable name cannot have bang symbol in the middle of the name.'>
      : T;

export const $variable = <TType, TVariableName extends string>(
  variableName: ValidVariableName<TVariableName>
): Variable<
  TType,
  TVariableName extends `${infer T}!` ? T : TVariableName,
  TVariableName extends `${string}!` ? true : false
> => ({
  __variableName: variableName.replace('!', '') as TVariableName extends `${infer T}!` ? T : TVariableName,
  __isRequired: variableName.includes('!') as TVariableName extends `${string}!` ? true : false,
  __isVariable: true,

  // TypeScript only property - no runtime
  __type: undefined as TType,
});
