export type Variable = {
  __variableName: string;
  __variableType: string;
};

export const createVariablesProxy = () => {
  const proxy = new Proxy(
    {},
    {
      get: (_target, property: string) => {
        return {
          __variableName: property,
          __variableType: property,
        };
      },
    }
  );

  return proxy;
};
