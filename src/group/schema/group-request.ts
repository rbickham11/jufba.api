import Joi from 'joi';

export default Joi.object().keys({
  name: Joi.string().min(1).max(50).required(),
  description: Joi.string().max(300).required(),
});