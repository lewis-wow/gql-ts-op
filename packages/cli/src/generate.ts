import {
  SchemaUnionsKey,
  parseSchemaType,
  type ArgsDescriptions,
  type FieldDescription,
  type ScalarsEnumsHash,
  type Schema,
  type Type,
} from 'gqty/Schema';
import type {
  GraphQLEnumType,
  GraphQLField,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLUnionType,
} from 'graphql';
import * as graphql from 'graphql';
import * as deps from './deps';
import { formatPrettier } from './prettier';

const {
  isEnumType,
  isInputObjectType,
  isInterfaceType,
  isNullableType,
  isObjectType,
  isScalarType,
  isUnionType,
  lexicographicSortSchema,
  assertSchema,
} = graphql;

export interface TransformSchemaOptions {
  /**
   * Get a field in which every argument is optional, if this functions return
   * "true", gqty will _always__ ignore it's arguments, and you won't be able to
   * specify them
   */
  ignoreArgs?: (type: GraphQLField<unknown, unknown>) => boolean;
}

export async function generate(
  schema: GraphQLSchema,
  { ignoreArgs }: TransformSchemaOptions = {}
): Promise<{
  schemaCode: string;
}> {
  const { format } = formatPrettier({
    parser: 'typescript',
  });

  schema = lexicographicSortSchema(assertSchema(schema));

  const config = schema.toConfig();

  const scalarsEnumsHash: ScalarsEnumsHash = {};

  const enumsNames: string[] = [];

  const inputTypeNames = new Set<string>();

  const generatedSchema: Schema = {
    query: {},
    mutation: {},
    subscription: {},
  };

  const queryType = config.query;
  const mutationType = config.mutation;
  const subscriptionType = config.subscription;

  const descriptions = new Map<string, string>();

  const fieldsDescriptions = new Map<string, Record<string, FieldDescription | undefined>>();

  const fieldsArgsDescriptions = new Map<string, ArgsDescriptions>();

  function addDescription(typeName: string | [parent: string, field: string, arg?: string]) {
    if (Array.isArray(typeName)) {
      const data = typeName[2]
        ? /* istanbul ignore next */
          fieldsArgsDescriptions.get(typeName[0])?.[typeName[1]]?.[typeName[2]]
        : /* istanbul ignore next */
          fieldsDescriptions.get(typeName[0])?.[typeName[1]];

      let comment = '';

      if (data?.description) {
        comment +=
          '\n' +
          data.description
            .trim()
            .split('\n')
            .map((line) => '* ' + line)
            .join('\n');
      }

      if (data?.deprecated) {
        comment += '\n* @deprecated ' + data.deprecated.trim().replace(/\n/g, '. ').trim();
      }

      if (data?.defaultValue) {
        comment += '\n* @defaultValue ' + '`' + data.defaultValue.trim() + '`';
      }

      return comment
        ? `/** ${comment}
      */\n`
        : '';
    } else {
      const desc = descriptions.get(typeName);
      return desc
        ? `/**
        ${desc
          .trim()
          .split('\n')
          .map((line) => '* ' + line)
          .join('\n')}
      */\n`
        : '';
    }
  }

  const parseEnumType = (type: GraphQLEnumType) => {
    scalarsEnumsHash[type.name] = true;
    enumsNames.push(type.name);

    const values = type.getValues();

    const enumValuesDescriptions: Record<string, FieldDescription> = {};

    for (const value of values) {
      if (value.deprecationReason || value.description) {
        enumValuesDescriptions[value.name] = {
          description: value.description,
          deprecated: value.deprecationReason,
        };
      }
    }

    fieldsDescriptions.set(type.name, enumValuesDescriptions);
  };
  const parseScalarType = (type: GraphQLScalarType) => {
    scalarsEnumsHash[type.name] = true;
  };

  const interfacesOfObjectTypesMap = new Map<string, string[]>();

  const parseObjectType = (type: GraphQLObjectType, typeName = type.name) => {
    const fields = type.getFields();
    const interfaces = type.getInterfaces();

    if (interfaces.length) {
      interfacesOfObjectTypesMap.set(
        type.name,
        interfaces.map((v) => v.name)
      );

      for (const interfaceType of interfaces) {
        let objectTypesList = unionsAndInterfacesObjectTypesMap.get(interfaceType.name);

        if (objectTypesList == null) {
          unionsAndInterfacesObjectTypesMap.set(interfaceType.name, (objectTypesList = []));
        }

        objectTypesList.push(type.name);
      }
    }

    const schemaType: Record<string, Type> = {
      __typename: { __type: 'String!' },
    };

    const objectFieldsDescriptions: Record<string, FieldDescription> = {};

    const objectFieldsArgsDescriptions: ArgsDescriptions = {};

    Object.entries(fields).forEach(([fieldName, gqlType]) => {
      if (gqlType.description || gqlType.deprecationReason) {
        objectFieldsDescriptions[fieldName] = {
          description: gqlType.description,
          deprecated: gqlType.deprecationReason,
        };
      }

      schemaType[fieldName] = {
        __type: gqlType.type.toString(),
      };

      if (gqlType.args.length) {
        if (ignoreArgs) {
          const isEveryArgOptional = gqlType.args.every(({ type }) => {
            return isNullableType(type);
          });

          if (isEveryArgOptional) {
            const shouldIgnore = ignoreArgs(gqlType);

            if (shouldIgnore) return;
          }
        }
        objectFieldsArgsDescriptions[fieldName] ||= {};

        schemaType[fieldName].__args = gqlType.args.reduce(
          (acum, arg) => {
            acum[arg.name] = arg.type.toString();
            if (arg.description || arg.deprecationReason || arg.defaultValue != null) {
              objectFieldsArgsDescriptions[fieldName][arg.name] = {
                defaultValue: arg.defaultValue != null ? JSON.stringify(arg.defaultValue) : null,
                deprecated: arg.deprecationReason,
                description: arg.description,
              };
            }
            return acum;
          },
          {} as Record<string, string>
        );
      }
    });

    fieldsDescriptions.set(type.name, objectFieldsDescriptions);
    fieldsArgsDescriptions.set(type.name, objectFieldsArgsDescriptions);

    generatedSchema[typeName] = schemaType;
  };

  const unionsAndInterfacesObjectTypesMap = new Map<string, string[]>();

  const parseUnionType = (type: GraphQLUnionType) => {
    const unionTypes = type.getTypes();

    const list: string[] = [];
    unionsAndInterfacesObjectTypesMap.set(type.name, list);

    for (const objectType of unionTypes) {
      list.push(objectType.name);
    }

    generatedSchema[type.name] = {
      __typename: { __type: 'String!' },
    };
  };

  const parseInputType = (type: GraphQLInputObjectType) => {
    inputTypeNames.add(type.name);
    const fields = type.getFields();

    const schemaType: Record<string, Type> = {};

    const inputFieldDescriptions: Record<string, FieldDescription> = {};

    Object.entries(fields).forEach(([key, value]) => {
      schemaType[key] = {
        __type: value.type.toString(),
      };
      if (value.description || value.deprecationReason || value.defaultValue) {
        inputFieldDescriptions[key] = {
          description: value.description,
          deprecated: value.deprecationReason,
          defaultValue: value.defaultValue != null ? JSON.stringify(value.defaultValue) : null,
        };
      }
    });

    generatedSchema[type.name] = schemaType;
  };

  type InterfaceMapValue = {
    fieldName: string;
  } & Type;

  const parseInterfaceType = (type: GraphQLInterfaceType) => {
    const schemaType: Record<string, Type> = {
      __typename: { __type: 'String!' },
    };

    const fields = type.getFields();

    const interfaceFieldDescriptions: Record<string, FieldDescription> = {};

    const objectFieldsArgsDescriptions: ArgsDescriptions = {};

    Object.entries(fields).forEach(([fieldName, gqlType]) => {
      const interfaceValue: InterfaceMapValue = {
        fieldName,
        __type: gqlType.type.toString(),
      };
      schemaType[fieldName] = {
        __type: gqlType.type.toString(),
      };

      let hasArgs = true;
      if (gqlType.args.length) {
        if (ignoreArgs) {
          const isEveryArgOptional = gqlType.args.every(({ type }) => {
            return isNullableType(type);
          });

          if (isEveryArgOptional) {
            const shouldIgnore = ignoreArgs(gqlType);

            if (shouldIgnore) {
              hasArgs = false;
            }
          }
        }
      } else {
        hasArgs = false;
      }

      if (hasArgs) {
        objectFieldsArgsDescriptions[fieldName] ||= {};

        schemaType[fieldName].__args = interfaceValue.__args = gqlType.args.reduce(
          (acum, arg) => {
            acum[arg.name] = arg.type.toString();
            if (arg.description || arg.deprecationReason || arg.defaultValue != null) {
              objectFieldsArgsDescriptions[fieldName][arg.name] = {
                defaultValue: arg.defaultValue != null ? JSON.stringify(arg.defaultValue) : null,
                deprecated: arg.deprecationReason,
                description: arg.description,
              };
            }
            return acum;
          },
          {} as Record<string, string>
        );
      }

      if (gqlType.description || gqlType.deprecationReason) {
        interfaceFieldDescriptions[fieldName] = {
          description: gqlType.description,
          deprecated: gqlType.deprecationReason,
        };
      }
    });
    fieldsDescriptions.set(type.name, interfaceFieldDescriptions);

    fieldsArgsDescriptions.set(type.name, objectFieldsArgsDescriptions);

    generatedSchema[type.name] = schemaType;
  };

  config.types.forEach((type) => {
    if (type.description) {
      descriptions.set(type.name, type.description);
    }
    if (type.name.startsWith('__') || type === queryType || type === mutationType || type === subscriptionType) {
      return;
    }

    /* istanbul ignore else */
    if (isScalarType(type)) {
      parseScalarType(type);
    } else if (isObjectType(type)) {
      parseObjectType(type);
    } else if (isInterfaceType(type)) {
      parseInterfaceType(type);
    } else if (isUnionType(type)) {
      parseUnionType(type);
    } else if (isEnumType(type)) {
      parseEnumType(type);
    } else if (isInputObjectType(type)) {
      parseInputType(type);
    }
  });

  /* istanbul ignore else */
  if (queryType) {
    parseObjectType(queryType, 'query');
  }

  if (mutationType) {
    parseObjectType(mutationType, 'mutation');
  }

  if (subscriptionType) {
    parseObjectType(subscriptionType, 'subscription');
  }

  const unionsMapObj = Array.from(unionsAndInterfacesObjectTypesMap.entries()).reduce(
    (acum, [key, value]) => {
      generatedSchema[key]!.$on = { __type: `$${key}!` };

      acum[key] = value;
      return acum;
    },
    {} as Record<string, string[]>
  );

  if (unionsAndInterfacesObjectTypesMap.size) {
    generatedSchema[SchemaUnionsKey] = unionsMapObj;
  }

  function parseArgType({
    pureType,
    isArray,
    nullableItems,
    isNullable,
    hasDefaultValue,
  }: ReturnType<typeof parseSchemaType>) {
    let typeToReturn: string[] = [
      scalarsEnumsHash[pureType]
        ? enumsNames.includes(pureType)
          ? pureType
          : `Scalars["${pureType}"]["output"]`
        : pureType,
    ];

    if (isArray) {
      typeToReturn = ['Array<', ...(nullableItems ? ['Maybe<', ...typeToReturn, '>'] : typeToReturn), '>'];
    }

    if (isNullable || hasDefaultValue) {
      typeToReturn = ['Maybe<', ...typeToReturn, '>'];
    }

    return typeToReturn.join('');
  }

  function parseFinalType({ pureType, isArray, nullableItems, isNullable }: ReturnType<typeof parseSchemaType>) {
    let typeToReturn: string[] = [scalarsEnumsHash[pureType] ? `Scalars["${pureType}"]["output"]` : pureType];

    if (isArray) {
      typeToReturn = ['Array<', ...(nullableItems ? ['Maybe<', ...typeToReturn, '>'] : typeToReturn), '>'];
    }

    if (isNullable) {
      typeToReturn = ['Maybe<', ...typeToReturn, '>'];
    }

    return typeToReturn.join('');
  }

  const objectTypeTSTypes = new Map<string, Map<string, string>>();

  let typescriptTypes = deps
    .sortBy(Object.entries(generatedSchema), (v) => v[0])
    .reduce((acum, [typeKey, typeValue]) => {
      const typeName = (() => {
        switch (typeKey) {
          case 'query': {
            return 'Query';
          }
          case 'mutation': {
            return 'Mutation';
          }
          case 'subscription': {
            return 'Subscription';
          }
          default: {
            return typeKey;
          }
        }
      })();

      if (inputTypeNames.has(typeName)) return acum;

      const objectTypeMap = new Map<string, string>();

      if (!unionsAndInterfacesObjectTypesMap.has(typeName)) {
        objectTypeTSTypes.set(typeName, objectTypeMap);
      }

      const interfaceOrUnionsObjectTypes = unionsAndInterfacesObjectTypesMap.get(typeName);

      acum += `

      ${addDescription(typeName)}export type ${typeName} = {
        __typename?: ${
          interfaceOrUnionsObjectTypes ? interfaceOrUnionsObjectTypes.map((v) => `"${v}"`).join(' | ') : `"${typeName}"`
        }; ${Object.entries(typeValue!).reduce((acum, [fieldKey, fieldValue]) => {
          if (fieldKey === '__typename') {
            objectTypeMap.set(fieldKey, `?: "${typeName}"`);
            return acum;
          }

          const typeFieldArgDescriptions = fieldsArgsDescriptions.has(typeName)
            ? fieldsArgsDescriptions.get(typeName)
            : undefined;
          const argDescriptions =
            typeFieldArgDescriptions && typeFieldArgDescriptions[fieldKey] ? typeFieldArgDescriptions[fieldKey] : {};
          const fieldValueProps = parseSchemaType(fieldValue.__type);
          const typeToReturn = parseFinalType(fieldValueProps);
          let finalType: string;
          if (fieldValue.__args) {
            const argsEntries = Object.entries(fieldValue.__args);
            let onlyNullableArgs = true;
            const argTypes = argsEntries.reduce((acum, [argKey, argValue]) => {
              const argValueProps = parseSchemaType(argValue, argDescriptions[argKey]);
              const connector = argValueProps.isNullable || argValueProps.hasDefaultValue ? '?:' : ':';

              if (!argValueProps.isNullable) {
                onlyNullableArgs = false;
              }

              const argTypeValue = parseArgType(argValueProps);

              acum += `${addDescription([typeName, fieldKey, argKey])}${argKey}${connector} ${argTypeValue};\n`;

              return acum;
            }, '');
            const argsConnector = onlyNullableArgs ? '?:' : ':';
            finalType = `: (args${argsConnector} {${argTypes}}) => ${typeToReturn}`;
          } else {
            const connector = fieldValueProps.isNullable ? '?:' : ':';
            finalType = `${connector} ${typeToReturn}`;
          }

          objectTypeMap.set(fieldKey, finalType);

          acum += '\n' + addDescription([typeName, fieldKey]) + fieldKey + finalType;

          return acum;
        }, '')}
      }
      `;

      return acum;
    }, '');

  if (unionsAndInterfacesObjectTypesMap.size) {
    typescriptTypes += `
    ${deps
      .sortBy(Array.from(unionsAndInterfacesObjectTypesMap.entries()), (v) => v[0])
      .reduce((acum, [unionInterfaceName, objectTypes]) => {
        acum += `
      export type $${unionInterfaceName} = {
        ${objectTypes.map((typeName) => `${typeName}?:${typeName}`).join('\n')}
      }
      `;

        return acum;
      }, '')}
    `;
  }

  typescriptTypes += `
    export type GeneratedSchema = {
      query: Query
      mutation: Mutation
      subscription: Subscription
    }
    `;

  const hasUnions = !!unionsAndInterfacesObjectTypesMap.size;

  const schemaCode = await format(typescriptTypes);

  return {
    schemaCode,
  };
}
