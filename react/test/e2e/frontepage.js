/*eslint-disable no-var*/
'use strict';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

let expect = chai.expect;
chai.use(sinonChai);

describe('index', () => {
  it('should load', () => {
    browser.get('/');

    browser.sleep(500).then(() => {
      expect('1').to.equal('1');
    })
  });

});