export type Simplify<T> = T extends any[] | Date ? T : { [K in keyof T]: T[K] };

export type IsAny<T> = 0 extends 1 & T ? true : false;

export type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};
