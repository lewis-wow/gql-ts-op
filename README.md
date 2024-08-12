# GQL TS OP

```ts
const myQuery = build((args: { my_id: string }) => ({
  query: {
    tweet: {
      __args: {
        id: args.my_id,
      },
      date: true,
      body: as('my_body'),
      author: as('my_author', {
        name: true,
        id: false,
      }),
    },
  },
}));
```

```graphql
query($my_id: String!) {
  tweet() {
    date
    my_body: body
    my_author: author {
      name
    }
  }
}
```
