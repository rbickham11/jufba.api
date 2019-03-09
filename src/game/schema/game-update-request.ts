import Joi from 'joi';

import GameState from '../state';

const validStates = [GameState.NotStarted, GameState.Running, GameState.Complete];

export default Joi.object().keys({
  date: Joi.date().iso().required(),
  structure: Joi.object().keys({
    sb: Joi.number(),
    bb: Joi.number(),
    ante: Joi.number(),
    minBuyIn: Joi.number(),
    maxBuyIn: Joi.number(),
  }),
  name: Joi.string().min(1).max(50),
  state: Joi.number().valid(validStates).default(GameState.NotStarted),
});