export type Simplify<T> = T extends any[] | Date ? T : { [K in keyof T]: T[K] };

export type IsAny<T> = 0 extends 1 & T ? true : false;

export type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type SpecialSelector__args = '__args';
export type SpecialSelector__as = '__as';
export type SpecialSelector__scalar = '__scalar';

export type SpecialSelectors = SpecialSelector__args | SpecialSelector__as | SpecialSelector__scalar;

/**
 * Matches any [primitive value](https://developer.mozilla.org/en-US/docs/Glossary/Primitive).
 */
export type Primitive = null | undefined | string | number | boolean | symbol | bigint;

export const GQL_TS_OP_ErrorMessageSymbol: unique symbol = Symbol('GQL_TS_OP_ErrorMessageSymbol');

export type ErrorMessage<T extends string> = T & {
  __error: typeof GQL_TS_OP_ErrorMessageSymbol;
};
