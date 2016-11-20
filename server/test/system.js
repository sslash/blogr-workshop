/*eslint-disable no-var*/
'use strict';
var hostUrl = (process.env.API_URL || "http://localhost:3000");
var request = require('supertest')(hostUrl);

describe('system', () => {
  it('ping respond with json', function(done) {
    request
      .get('/api/system/ping')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('info respond with json', function(done) {
    request
      .get('/api/system/info')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});