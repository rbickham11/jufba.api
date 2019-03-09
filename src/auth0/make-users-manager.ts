import UsersManager from 'auth0/src/auth/UsersManager';
import { ACCOUNT_URL } from './config';

let manager : UsersManager;

export default function makeAuth0UsersManager() : UsersManager {
  if (manager) return manager;

  manager = new UsersManager({
    baseUrl: ACCOUNT_URL,
  });

  return manager;
}