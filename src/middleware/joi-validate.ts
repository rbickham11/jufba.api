import { Request, Response, NextFunction } from 'express';
import Joi, { ObjectSchema } from 'joi';
import isArray from 'lodash/isArray';

export default function joiValidate(schema: ObjectSchema, isCollection: boolean = false, sanitize: boolean = true) {
  return function joiValidate(req: Request, res: Response, next: NextFunction) {
    const obj = req.body;

    if (isCollection) {
      if (!isArray(obj.results)) {
        const msg = 'Invalid collection was supplied to the validation middleware';

        return res.status(400).json({ message: msg });
      }

      let resultsAcc : any[] = [];

      for (let item of obj.results) {
        const validationResult = validateJoiObject(item, schema, sanitize);

        if (!validationResult.valid) {
          return res.status(400).json({ message: validationResult.error });
        }

        if (sanitize) {
          resultsAcc = [...resultsAcc, validationResult.value];
        } else {
          resultsAcc = [...resultsAcc, item];
        }
      }

      obj.results = resultsAcc;
    } else {
      const validationResult = validateJoiObject(obj, schema, sanitize);

      if (!validationResult.valid) {
        return res.status(400).json({ message: validationResult.error });
      }

      if (sanitize) {
        req.body = validationResult.value;
      }
    }

    return next();
  };
};

function validateJoiObject(object: Object, schema: ObjectSchema, stripUnknown: boolean) {
  const { error, value } = Joi.validate(object, schema, {
    abortEarly: false,
    stripUnknown,
  });

  return { valid: !error, error, value };
};
