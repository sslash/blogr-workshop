const env = (process.env.NODE_ENV || 'development').trim();
const cfg = require('./config.'+env);

module.exports = cfg;