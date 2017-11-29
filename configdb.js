var mongoClient = require('mongodb').MongoClient;
module.exports = {
    getConnection: function(callback){
        mongoClient.connect("mongodb://localhost/chat_example", function(err, db){
            if(err)
            {
                console.log('Err db' + err);
            }
            else
            {
                return callback(db);
            }
        })
    }
};
