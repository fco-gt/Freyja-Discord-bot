const mongo = require('mongoose');

module.exports = mongo.model(
    'Users',
    new mongo.Schema({
        id: String,
        username: String,
        steam_id: String
    })
)