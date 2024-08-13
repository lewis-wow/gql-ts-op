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

```json
{
  "query": {
    "tweet": {
      "__args": { "id": { "__variableName": "my_id" } },
      "date": true,
      "body": { "__as": "my_body", "value": true },
      "author": { "__as": "my_author", "value": { "name": true, "id": false } }
    }
  }
}
```

```graphql
query ($my_id: ID!) {
  tweet(id: $my_id) {
    date
    my_body: body
    my_author: author {
      name
    }
  }
}
```
