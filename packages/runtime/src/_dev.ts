import { as } from './as';
import { GQLBuilder } from './main';

const { query } = new GQLBuilder<{
  query: {
    tweet: (args: { id: string }) => {
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
}>();

const myQuery = query((args: { my_id: string }) => ({
  tweet: {
    __args: {
      id: args.my_id,
    },
    __scalar: true,
    createdAt: false,
    authors: as('my_author', {
      username: true,
      __scalar: true,
      id: false,
    }),
  },
}));

console.log(JSON.stringify(myQuery as any));
