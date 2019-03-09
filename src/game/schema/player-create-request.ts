import Joi from 'joi';

export default Joi.object().keys({
  buyIn: Joi.number().min(0),
  finalChipCount: Joi.number().min(0),
  maxChips: Joi.number().min(0),
  minChips: Joi.number().min(0),
  userId: Joi.string().required(),
});