/*eslint-disable no-var*/
'use strict';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

let expect = chai.expect;
chai.use(sinonChai);

describe('frontpage', () => {
  it('should have title Blogr', () => {
    browser.get('/');
    browser.getTitle().then(function (title) {
         expect(title).to.equal('Blogr');
    });
  });
});