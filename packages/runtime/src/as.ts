export type As<TAlias extends string, TValue> = TValue & {
  __as: TAlias;
};

export function as<TAlias extends string, TValue>(alias: TAlias, value: TValue): As<TAlias, TValue>;
export function as<TAlias extends string>(alias: TAlias): As<TAlias, true>;
export function as<TAlias extends string, TValue>(alias: TAlias, value?: TValue): As<TAlias, TValue> {
  return {
    __as: alias,
    ...value,
  } as As<TAlias, TValue>;
}
