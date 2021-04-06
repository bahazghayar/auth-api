'use strict';

require('dotenv').config();
const supergoose = require('@code-fellows/supergoose');
const jwt = require('jsonwebtoken');

const Users = require('../../../src/auth/models/users.js');
const { server } = require('../../../src/server.js');
const request = supergoose(server);

let id;
let SECRET = process.env.SECRET || 'supersecret';
let users = {
  admin: { username: 'admin', password: 'password', role: 'admin' },
  editor: { username: 'editor', password: 'password', role: 'editor' },
  user: { username: 'user', password: 'password', role: 'user' },
};

beforeAll(async (done) => {
  await new Users(users.admin).save();
  await new Users(users.user).save();
  done();
});

const user = { username: 'admin' };
const token = jwt.sign(user, SECRET);

const basic = { username: 'basic' };
const basicToken = jwt.sign(basic, SECRET);

describe('test /users and /secret routes', () => {
  it('should allow access to all users to access /secret route', async () => {
    const response = await request
      .get('/secret')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(200);
    expect(response.text).toEqual('Welcome to the secret area');
  });
  it('should not allow users with wrong token to access /secret route', async () => {
    const response = await request
      .get('/secret')
      .set('Authorization', `Bearer thisiswrongtoken`);
    expect(response.status).toEqual(500);
  });
  it('should not allow non users to access /secret route', async () => {
    const response = await request.get('/secret');
    expect(response.status).toEqual(500);
  });
  it('should allow admin users to access /users route', async () => {
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });
  it('should not allow all users to access /users route', async () => {
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${basicToken}`);
    expect(response.status).toEqual(500);
  });
});

describe('Model CRUD Test', () => {
  it('read all from DataBase test on GET /clothes when there is no data', async () => {
    const response = await request
      .get('/api/v2/clothes')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([]);
  });
  it('create test on POST /clothes', async () => {
    const response = await request
      .post('/api/v2/clothes')
      .send({
        name: 'pants',
        color: 'black',
        size: 'm',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual('pants');
    id = response.body._id;
  });
  it('should be able to read specific data on GET /clothes', async () => {
    const response = await request
      .get(`/api/v2/clothes/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('pants');
  });
  it('should throw an error if the ID does not exist on GET /clothes', async () => {
    const response = await request
      .get(`/api/v2/clothes/1`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(500);
  });
  it('read all from DataBase test on GET /clothes', async () => {
    const response = await request
      .get('/api/v2/clothes')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });
  it('should be able to update data on PUT /clothes', async () => {
    const response = await request
      .put(`/api/v2/clothes/${id}`)
      .send({
        name: 'Pants',
        color: 'Black',
        size: 'M',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('Pants');
  });
  it('should throw an error if the ID does not exist on PUT /clothes', async () => {
    const response = await request
      .put(`/api/v2/clothes/1`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(500);
  });
  it('should be able to delete data on DELETE /clothes', async () => {
    const response = await request
      .delete(`/api/v2/clothes/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(200);
  });
  it('should throw an error if the ID does not exist on DELETE /clothes', async () => {
    const response = await request
      .delete(`/api/v2/clothes/1`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(500);
  });
  it('should throw an error if you add invalid model', async () => {
    const response = await request
      .get('/api/v2/movies')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(500);
  });
  it('should deny access for the user with the wrong token', async () => {
    const response = await request
      .post(`/api/v2/clothes`)
      .send({
        name: 'Shirt',
        color: 'Blue',
        size: 'XL',
      })
      .set('Authorization', `Bearer ${basicToken}`);
    expect(response.status).toEqual(500);
  });
  it('should deny access for the user without a token', async () => {
    const response = await request
      .post(`/api/v2/clothes`)
      .send({
        name: 'Shirt',
        color: 'Blue',
        size: 'XL',
      })
      .set('Authorization', `Bearer thisiswrongtoken`);
    expect(response.status).toEqual(500);
  });
});