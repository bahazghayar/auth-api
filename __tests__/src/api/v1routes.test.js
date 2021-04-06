'use strict';

require('dotenv').config();
const supergoose = require('@code-fellows/supergoose');
const { server } = require('../../../src/server.js');
const request = supergoose(server);
let id;

describe('Model CRUD Test', () => {
  it('read all from DataBase test on GET /clothes when there is no data', async () => {
    const response = await request.get('/api/v1/clothes');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([]);
  });
  it('create test on POST /clothes', async () => {
    const response = await request.post('/api/v1/clothes').send({
      name: 'pants',
      color: 'black',
      size: 'm',
    });
    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual('pants');
    id = response.body._id;
  });
  it('should be able to read specific data on GET /clothes', async () => {
    const response = await request.get(`/api/v1/clothes/${id}`);
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('pants');
  });
  it('should throw an error if the ID does not exist on GET /clothes', async () => {
    const response = await request.get(`/api/v1/clothes/1`);
    console.log(response.status);
    expect(response.status).toEqual(500);
  });
  it('read all from DataBase test on GET /clothes', async () => {
    const response = await request.get('/api/v1/clothes');
    expect(response.status).toEqual(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });
  it('should be able to update data on PUT /clothes', async () => {
    const response = await request.put(`/api/v1/clothes/${id}`).send({
      name: 'Pants',
      color: 'Black',
      size: 'M',
    });
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('Pants');
  });
  it('should throw an error if the ID does not exist on PUT /clothes', async () => {
    const response = await request.put(`/api/v1/clothes/1`);
    expect(response.status).toEqual(500);
  });
  it('should be able to delete data on DELETE /clothes', async () => {
    const response = await request.delete(`/api/v1/clothes/${id}`);
    expect(response.status).toEqual(200);
  });
  it('should throw an error if the ID does not exist on DELETE /clothes', async () => {
    const response = await request.delete(`/api/v1/clothes/1`);
    expect(response.status).toEqual(500);
  });
  it('should throw an error if you add invalid model', async () => {
    const response = await request.get('/api/v1/movies');
    expect(response.status).toEqual(500);
  });
});