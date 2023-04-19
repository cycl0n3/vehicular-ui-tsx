import axios from 'axios';

import { config } from './Constants';
import { IUser } from '../context/UserContext';

const instance = axios.create({
  baseURL: config.url.API_BASE_URL
})

const authenticate = (username: string, password: string) => {
  return instance.post('/auth/authenticate', {
    username,
    password
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

const register = (username: string, password: string) => {
  return instance.post('/auth/signup', {
    username,
    password
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

const findMe = (user: IUser | null) => {
  if(!user) return Promise.reject('User is null');

  return instance.get('/api/users/me', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.accessToken}`
    }
  });
}

export const connection = {
  authenticate,
  register,
  findMe
}
