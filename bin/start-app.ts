import express, { Router } from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';

import checkJwt from '../src/middleware/check-jwt';
import makeDatabase from '../src/database/make-database';
import makeUsersManager from '../src/auth0/make-users-manager';

import initializeUserRouter from '../src/user/initialize-router';
import HandleGetUser from '../src/user/handlers/get-user';

import initializeGroupRouter from '../src/group/initialize-router';
import HandleCreateGroup from '../src/group/handlers/create-group';
import HandleDestroyGroup from '../src/group/handlers/destroy-group';
import HandleGetGroupList from '../src/group/handlers/get-group-list';
import HandleGetGroup from '../src/group/handlers/get-group';
import HandleUpdateGroup from '../src/group/handlers/update-group';
import HandleUpsertUserToGroup from '../src/group/handlers/upsert-user-to-group';

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

const handleGetUser = HandleGetUser({ db, auth0UsersManager });

const handleCreateGroup = HandleCreateGroup({ db });
const handleDestroyGroup = HandleDestroyGroup({ db });
const handleGetGroupList = HandleGetGroupList({ db });
const handleGetGroup = HandleGetGroup({ db });
const handleUpdateGroup = HandleUpdateGroup({ db });
const handleUpsertUserToGroup = HandleUpsertUserToGroup({ db });

const groupHandlers = {
  create: handleCreateGroup,
  destroy: handleDestroyGroup,
  list: handleGetGroupList,
  get: handleGetGroup,
  update: handleUpdateGroup,
  upsertUser: handleUpsertUserToGroup,
}

app.use('/groups', initializeGroupRouter(Router(), groupHandlers));
app.use('/user', initializeUserRouter(Router(), { get: handleGetUser }));

const HTTP_PORT = process.env.HTTP_PORT || 4000;

app.listen(HTTP_PORT, () => { console.log(`App listening on port ${HTTP_PORT}`)});