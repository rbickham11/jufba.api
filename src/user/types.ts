import { Timestamps } from '../types';

export interface User extends Timestamps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}