import { Tweet } from './__test__/schema.generated';
import { Equal, Expect } from './__test__/types';
import { FieldsSelection } from './fieldsSelection';

/**
 * Test: Result should be empty on empty selection
 */
type _ShouldBeEmptyObject = FieldsSelection<
  {
    tweet: Tweet;
  },
  {
    tweet: {};
  }
>;

type ShouldBeEmptyObject = Expect<
  Equal<
    _ShouldBeEmptyObject,
    {
      tweet: {};
    }
  >
>;

/**
 * Test: Result should have id property only on id selection
 */
type _ShouldHaveIdPropertyOnly = FieldsSelection<
  {
    tweet: Tweet;
  },
  {
    tweet: {
      id: true;
    };
  }
>;

type ShouldHaveIdPropertyOnly = Expect<
  Equal<
    _ShouldHaveIdPropertyOnly,
    {
      tweet: {
        id: string;
      };
    }
  >
>;

/**
 * Test: Result should have nullable body property only on body selection
 */
type _ShouldHaveBodyPropertyOnly = FieldsSelection<
  {
    tweet: Tweet;
  },
  {
    tweet: {
      body: true;
    };
  }
>;

type ShouldHaveBodyPropertyOnly = Expect<
  Equal<
    _ShouldHaveBodyPropertyOnly,
    {
      tweet: {
        body?: string | null | undefined;
      };
    }
  >
>;

/**
 * Test: Result should have nullable body and id property
 */
type _ShouldHaveBodyAndIdPropertyOnly = FieldsSelection<
  {
    tweet: Tweet;
  },
  {
    tweet: {
      id: true;
      body: true;
    };
  }
>;

type ShouldHaveBodyAndIdPropertyOnly = Expect<
  Equal<
    _ShouldHaveBodyAndIdPropertyOnly,
    {
      tweet: {
        id: string;
        body?: string | null | undefined;
      };
    }
  >
>;

/**
 * Test: Result should all scalars types on __scalar selection
 */
type _ShouldHaveAllScalarTypes = FieldsSelection<
  {
    tweet: Tweet;
  },
  {
    tweet: {
      __scalar: true;
    };
  }
>;

type ShouldHaveAllScalarTypes = Expect<
  Equal<
    _ShouldHaveAllScalarTypes,
    {
      tweet: {
        id: string;
        body?: string | null | undefined;
        date?: any;
        __typename?: 'Tweet' | undefined;
      };
    }
  >
>;

/**
 * Test: Result should have all scalar types but one on __scalar selection and annulation
 */
type _ShouldHaveAllScalarButOneTypes = FieldsSelection<
  {
    tweet: Tweet;
  },
  {
    tweet: {
      __scalar: true;
      body: false;
    };
  }
>;

type ShouldHaveAllScalarButOneTypes = Expect<
  Equal<
    _ShouldHaveAllScalarButOneTypes,
    {
      tweet: {
        id: string;
        date?: any;
        __typename?: 'Tweet' | undefined;
      };
    }
  >
>;

/**
 * Test: Result should have nested author type
 */
type _ShouldHaveAuthorNestedObject = FieldsSelection<
  {
    tweet: Tweet;
  },
  {
    tweet: {
      author: {
        id: string;
      };
    };
  }
>;

type ShouldHaveAuthorNestedObject = Expect<
  Equal<
    _ShouldHaveAuthorNestedObject,
    {
      tweet: {
        author:
          | {
              id: string;
            }
          | null
          | undefined;
      };
    }
  >
>;

/**
 * Test: Result should have nested author with __scalar options
 */
type _ShouldHaveAuthorNestedObjectWithScalars = FieldsSelection<
  {
    tweet: Tweet;
  },
  {
    tweet: {
      __scalar: true;
      author: {
        __scalar: true;
      };
    };
  }
>;

type ShouldHaveAuthorNestedObjectWithScalars = Expect<
  Equal<
    _ShouldHaveAuthorNestedObjectWithScalars,
    {
      tweet: {
        id: string;
        body?: string | null | undefined;
        date?: any;
        __typename?: 'Tweet' | undefined;
        author:
          | {
              __typename?: 'User';
              avatar_url?: any | null | undefined;
              first_name?: string | null | undefined;
              full_name?: string | null | undefined;
              id: string;
              last_name?: string | null | undefined;
              username?: string | null | undefined;
            }
          | null
          | undefined;
      };
    }
  >
>;
