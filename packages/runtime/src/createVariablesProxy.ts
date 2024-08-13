export const createVariablesProxy = (property?: string) => {
  const proxy: {
    __variableName: string | undefined;
  } = new Proxy(
    {
      __variableName: property,
    },
    {
      get: (_target, property: string) => {
        return createVariablesProxy(property);
      },
    }
  );

  return proxy;
};
