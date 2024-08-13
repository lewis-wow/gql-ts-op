import { as } from './as';
import { createBuilder } from './main';

const { build } = createBuilder<{
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

const query = build((args: { my_id: string }) => ({
  query: {
    tweet: {
      __args: {
        id: args.my_id,
      },
      __scalar: true,
      id: as('my_dd'),
      authors: as('a', {
        __scalar: true,
      }),
    },
  },
}));

console.log((query as any).query.tweet);
