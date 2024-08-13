export class Variable {
  __variableName: string;

  constructor(options: { name: string }) {
    this.__variableName = options.name;
  }

  static createProxy() {
    const proxy = new Proxy(
      {},
      {
        get: (_target, property: string) => {
          return new Variable({ name: property });
        },
      }
    );

    return proxy;
  }
}
