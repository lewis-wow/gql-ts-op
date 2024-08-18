export type Simplify<T> = T extends any[] | Date ? T : { [K in keyof T]: T[K] };

export type IsAny<T> = 0 extends 1 & T ? true : false;

export type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

export const GQL_TS_OP_ErrorMessageSymbol: unique symbol = Symbol('GQL_TS_OP_ErrorMessageSymbol');

export type ErrorMessage<T extends string> = T & {
  __error: typeof GQL_TS_OP_ErrorMessageSymbol;
};
