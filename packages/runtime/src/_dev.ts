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
      createdAt: false,
      authors: as('my_author', {
        username: true,
        id: false,
      }),
    },
  },
}));

console.log(JSON.stringify(query as any));
