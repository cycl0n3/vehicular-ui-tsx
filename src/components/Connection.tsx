import axios from 'axios';

import { config } from './Constants';

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

export const connection = {
  authenticate,
  register
}
