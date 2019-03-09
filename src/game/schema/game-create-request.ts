import Joi from 'joi';

import GameState from '../state';
import GameType from '../game-type';

const validStates = [GameState.NotStarted, GameState.Running, GameState.Complete];
const validTypes = [GameType.PokerCash, GameType.PokerTournament];

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
  type: Joi.string().valid(validTypes).required(),
  groupId: Joi.string().required(),
});