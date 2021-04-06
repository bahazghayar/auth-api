'use strict';

require('dotenv').config();
const supergoose = require('@code-fellows/supergoose');
const {server} = require('../../src/server.js');
const request = supergoose(server);

describe('Server Test', () => {
  // it('handle working routes', async () => {
  //   const response = await request.get('/');
  //   expect(response.status).toEqual(200);
  //   expect(response.text).toEqual('Home Page');
  // });
  // it('handle server errors', async () => {
  //   const response = await request.get('/bad');
  //   expect(response.status).toEqual(500);
  // });
  it('handle invalid routes', async () => {
    const response = await request.get('/whatever');
    expect(response.status).toEqual(404);
  });
  it('handle bad method', async () => {
    const response = await request.patch('/*');
    expect(response.status).toEqual(404);
  });
});