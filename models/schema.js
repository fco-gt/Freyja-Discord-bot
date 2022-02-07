const mongo = require('mongoose');

module.exports = mongo.model(
    'Levels', 
    new mongo.Schema({
        id: String,
        coins: Number
    })
)
