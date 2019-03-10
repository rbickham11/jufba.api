import express, { Router, Request, Response, NextFunction } from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';

import checkJwt from '../src/middleware/check-jwt';
import ExpandUser from '../src/middleware/expand-user';
import makeDatabase from '../src/database/make-database';
import makeUsersManager from '../src/auth0/make-users-manager';
import GetGroupMemberList from '../src/group/get-group-member-list';
import CheckIsGroupAdmin from '../src/group/check-is-group-admin';

import initializeUserRouter from '../src/user/initialize-router';
import HandleGetUser from '../src/user/handlers/get-user';

import initializeGroupRouter from '../src/group/initialize-router';
import HandleCreateGroup from '../src/group/handlers/create-group';
import HandleDestroyGroup from '../src/group/handlers/destroy-group';
import HandleGetGroupList from '../src/group/handlers/get-group-list';
import HandleGetGroup from '../src/group/handlers/get-group';
import HandleUpdateGroup from '../src/group/handlers/update-group';
import HandleUpsertUserToGroup from '../src/group/handlers/upsert-user-to-group';
import HandleRemoveUserFromGroup from '../src/group/handlers/remove-user-from-group';

import initializeGameRouter from '../src/game/initialize-router';
import HandleCreateGame from '../src/game/handlers/create-game';
import HandleDestroyGame from '../src/game/handlers/destroy-game';
import HandleGetGameList from '../src/game/handlers/get-game-list';
import HandleGetGame from '../src/game/handlers/get-game';
import HandleUpdateGame from '../src/game/handlers/update-game';
import HandleGetPlayerList from '../src/game/handlers/get-player-list';
import HandleCreatePlayer from '../src/game/handlers/create-player';
import HandleUpdatePlayer from '../src/game/handlers/update-player';
import HandleDestroyPlayer from '../src/game/handlers/destroy-player';


const app = express();

app.disable('x-powered-by');
app.enable('strict routing');
app.enable('case sensitive routing');

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

app.use(checkJwt);

const db = makeDatabase();
const auth0UsersManager = makeUsersManager();
const expandUser = ExpandUser({ db });
const getGroupMemberList = GetGroupMemberList({ db });
const checkIsGroupAdmin = CheckIsGroupAdmin({ db });

const handleGetUser = HandleGetUser({ db, auth0UsersManager });

const handleCreateGroup = HandleCreateGroup({ db });
const handleDestroyGroup = HandleDestroyGroup({ db, checkIsGroupAdmin });
const handleGetGroupList = HandleGetGroupList({ db });
const handleGetGroup = HandleGetGroup({ db, getGroupMemberList });
const handleUpdateGroup = HandleUpdateGroup({ db, checkIsGroupAdmin });
const handleUpsertUserToGroup = HandleUpsertUserToGroup({ db, checkIsGroupAdmin });
const handleRemoveUserFromGroup = HandleRemoveUserFromGroup({ db, checkIsGroupAdmin });

const handleCreateGame = HandleCreateGame({ db });
const handleDestroyGame = HandleDestroyGame({ db });
const handleGetGameList = HandleGetGameList({ db });
const handleGetGame = HandleGetGame({ db });
const handleUpdateGame = HandleUpdateGame({ db });
const handleGetPlayerList = HandleGetPlayerList({ db });
const handleCreatePlayer = HandleCreatePlayer({ db });
const handleUpdatePlayer = HandleUpdatePlayer({ db });
const handleDestroyPlayer = HandleDestroyPlayer({ db });

const groupHandlers = {
  create: handleCreateGroup,
  destroy: handleDestroyGroup,
  list: handleGetGroupList,
  get: handleGetGroup,
  update: handleUpdateGroup,
  upsertUser: handleUpsertUserToGroup,
  removeUser: handleRemoveUserFromGroup,
};

const gameHandlers = {
  create: handleCreateGame,
  destroy: handleDestroyGame,
  list: handleGetGameList,
  get: handleGetGame,
  update: handleUpdateGame,

  getPlayerList: handleGetPlayerList,
  createPlayer: handleCreatePlayer,
  updatePlayer: handleUpdatePlayer,
  destroyPlayer: handleDestroyPlayer,
}

app.use('/games', expandUser, initializeGameRouter(Router(), gameHandlers));
app.use('/groups', expandUser, initializeGroupRouter(Router(), groupHandlers));
app.use('/user', initializeUserRouter(Router(), { get: handleGetUser }));

// Default error middleware to catch uncaught, non-rejection errors
app.use((err, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') { 
    // Catch error from express-jwt middleware
    res.status(401).json({ message: 'Invalid or missing authorization token' });

    return;
  }

  res.status(500).json({ message: err.message });
});

const HTTP_PORT = process.env.HTTP_PORT || 4000;

app.listen(HTTP_PORT, () => { console.log(`App listening on port ${HTTP_PORT}`)});