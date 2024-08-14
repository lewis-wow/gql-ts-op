import { ErrorMessage } from './types';

export type AsAliasCheck<TAlias extends string> = TAlias extends ''
  ? ErrorMessage<'Alias name must have length'>
  : TAlias;

export type AsValueCheck<TValue> =
  TValue extends As<string, any> ? ErrorMessage<'Alias cannot have Alias as value'> : TValue;

export type As<TAlias extends string, TValue> = {
  __as: AsAliasCheck<TAlias>;
  value: AsValueCheck<TValue>;
};

export function as<TAlias extends string, TValue>(
  alias: AsAliasCheck<TAlias>,
  value: AsValueCheck<TValue>
): As<TAlias, TValue>;
export function as<TAlias extends string>(alias: AsAliasCheck<TAlias>): As<TAlias, true>;
export function as<TAlias extends string, TValue>(
  alias: AsAliasCheck<TAlias>,
  value?: AsValueCheck<TValue>
): As<TAlias, TValue> {
  return {
    __as: alias,
    value: (value ?? true) as AsValueCheck<TValue>,
  };
}
