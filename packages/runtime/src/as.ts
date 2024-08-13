export type AliasNameMustHaveLength = 'Alias name must have length';

export type AliasCannotHaveAliasAsValueError = 'Alias cannot have Alias as value';

export class Alias<TAlias extends string, TValue> {
  __as: TAlias;
  value: TValue;

  constructor(options: {
    alias: TAlias extends '' ? AliasNameMustHaveLength : TAlias;
    value: TValue extends Alias<string, any> ? AliasCannotHaveAliasAsValueError : TValue;
  }) {
    this.__as = options.alias as TAlias;
    this.value = options.value as TValue;
  }
}

export function as<TAlias extends string, TValue>(
  alias: TAlias extends '' ? AliasNameMustHaveLength : TAlias,
  value: TValue extends Alias<string, any> ? AliasCannotHaveAliasAsValueError : TValue
): Alias<TAlias, TValue>;
export function as<TAlias extends string>(
  alias: TAlias extends '' ? AliasNameMustHaveLength : TAlias
): Alias<TAlias, true>;
export function as<TAlias extends string, TValue>(
  alias: TAlias extends '' ? AliasNameMustHaveLength : TAlias,
  value?: TValue extends Alias<string, any> ? AliasCannotHaveAliasAsValueError : TValue
): Alias<TAlias, TValue> {
  return new Alias<TAlias, TValue>({
    alias,
    value: (value ?? true) as TValue extends Alias<string, any> ? AliasCannotHaveAliasAsValueError : TValue,
  });
}
