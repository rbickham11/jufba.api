import Joi from 'joi';

export default Joi.object().keys({
  firstName: Joi.string().max(50).required(),
  lastName: Joi.string().max(50).required(),
});