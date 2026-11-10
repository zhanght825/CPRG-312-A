const { test } = require('node:test');
const assert = require('node:assert/strict');
const csrf = require('../src/middlewares/csrf');
function invoke(method, stored, sent) {
    let status = null;
    const req = { method, session: { csrfToken: stored }, get: () => sent };
    const res = { status(code) { status = code; return this; }, json() { return this; } };
    let passed = false;
    csrf(req, res, () => { passed = true; });
    return { status, passed };
}
test('GET is safe', () => assert.equal(invoke('GET', undefined, undefined).passed, true));
test('POST without token returns 403', () => assert.equal(invoke('POST', 'secret', undefined).status, 403));
test('POST with wrong token returns 403', () => assert.equal(invoke('POST', 'secret', 'wrong!').status, 403));
test('POST with matching token succeeds', () => assert.equal(invoke('POST', 'secret', 'secret').passed, true));
