import { as } from './as';
import { GQLBuilder } from './main';

type Schema = {
  query: {
    tweet: (args: { id?: string }) => {
      id: string;
      content: {
        header: any;
        body: any;
        footer: any;
      };
      createdAt: any;
      updatedAt: any;
      authors: (args?: { filter?: { age?: number; username?: string } }) => {
        username: string;
        id: string;
        age: string;
        createdAt: any;
        updatedAt: any;
      }[];
    };
  };
};

const { query, mutation } = new GQLBuilder<Schema>();

const f = mutation(() => ({}));

const myQuery = query(($) => ({
  tweet: {
    __args: {
      id: $('my_id!'),
    },
  },
}));

console.log(JSON.stringify(myQuery as any));
