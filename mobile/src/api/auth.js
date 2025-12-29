import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://192.168.1.64:3000';

export const saveToken = async (token) => {
  await SecureStore.setItemAsync('token', token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync('token');
};

export const register = async (username, password) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
};

export const login = async (username, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
};
