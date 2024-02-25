import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
// import Ajv, { ErrorObject } from 'ajv';

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const { name } = JSON.parse(event.body);

  return formatJSONResponse(
    {
    message: `Hello , welcome ${ name }!`,
    event,
  });
};

//реализация валидации
// const ajv = new Ajv();

// const validate = ajv.compile(schema);

// const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
//   try {
//     if (!event.body) {
//       throw new Error('Request body is empty');
//     }

//     const body = event.body;

//     if (!validate(body)) {
      
//       const errors: ErrorObject[] | null | undefined = validate.errors;
//       const errorMessage = errors ? errors.map((error) => error.message).join(', ') : 'Invalid request body';
//       throw new Error(errorMessage);
//     }

//     return formatJSONResponse({
//       message: `Hello, welcome to the exciting Serverless world!`,
//       event,
//     });
//   } catch (error) {
//     return formatJSONResponse({
//       message: error.message || 'Internal Server Error',
//     });
//   }
// };

export const main = middyfy(hello);
