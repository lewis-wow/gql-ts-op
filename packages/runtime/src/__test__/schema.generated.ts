/**
 * GQty AUTO-GENERATED CODE: PLEASE DO NOT MODIFY MANUALLY
 */

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Date: { input: any; output: any };
  Url: { input: any; output: any };
}

export const scalarsEnumsHash = {
  Boolean: true,
  Date: true,
  ID: true,
  String: true,
  Url: true,
};
export const generatedSchema = {
  Tweet: {
    __typename: { __type: 'String!' },
    author: { __type: 'User', __args: { filter: 'String' } },
    body: { __type: 'String' },
    date: { __type: 'Date' },
    id: { __type: 'ID!' },
  },
  User: {
    __typename: { __type: 'String!' },
    avatar_url: { __type: 'Url' },
    first_name: { __type: 'String' },
    full_name: { __type: 'String' },
    id: { __type: 'ID!' },
    last_name: { __type: 'String' },
    username: { __type: 'String' },
  },
  mutation: {},
  query: {
    __typename: { __type: 'String!' },
    tweet: { __type: 'Tweet', __args: { id: 'ID!' } },
  },
  subscription: {},
} as const;

export interface Tweet {
  __typename?: 'Tweet';
  author: (args?: { filter?: Maybe<ScalarsEnums['String']> }) => Maybe<User>;
  body?: Maybe<ScalarsEnums['String']>;
  date?: Maybe<ScalarsEnums['Date']>;
  id: ScalarsEnums['ID'];
}

export interface User {
  __typename?: 'User';
  avatar_url?: Maybe<ScalarsEnums['Url']>;
  first_name?: Maybe<ScalarsEnums['String']>;
  full_name?: Maybe<ScalarsEnums['String']>;
  id: ScalarsEnums['ID'];
  last_name?: Maybe<ScalarsEnums['String']>;
  username?: Maybe<ScalarsEnums['String']>;
}

export interface Mutation {
  __typename?: 'Mutation';
}

export interface Query {
  __typename?: 'Query';
  tweet: (args: { id: ScalarsEnums['ID'] }) => Maybe<Tweet>;
}

export interface Subscription {
  __typename?: 'Subscription';
}

export interface GeneratedSchema {
  query: Query;
  mutation: Mutation;
  subscription: Subscription;
}

export type ScalarsEnums = {
  [Key in keyof Scalars]: Scalars[Key] extends { output: unknown } ? Scalars[Key]['output'] : never;
} & {};
