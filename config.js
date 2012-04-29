var config = {};

config.web = {};
config.github = {};

config.github.client_id = '9b811fa8146dbd5d0b35';
config.github.client_secret = '503ad50e04a62b1e01df184d951a204dbca3d77d';

config.web.port = process.env.WEB_PORT || process.env.PORT || 9099;


module.exports = config;