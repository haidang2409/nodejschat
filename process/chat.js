/**
 * Created by nguyen hai dang on 07/17/2015.
 */
var connection = require('../configdb');
exports.addContentChat = function(data, callback){
    var now = new Date();
    var chat = {
        userIdSender: data.userIdSender,
        userIdReceiver: data.userIdReceiver,
        content: data.content,
        dateTimeChat: new Date()
    };
    connection.getConnection(function(db){
        db.collection('chat', function(err, collection){
            collection.insert(chat, function(err, result){
                if(err)
                {
                    console.log(err);
                    return callback(false);
                }
                else
                {
                    return callback(true);
                }
            });
        });
    });
};
exports.getListChat = function(userId1, userId2, callback){
    connection.getConnection(function(db){
        db.collection('chat', function(err, collection){
            collection.find({$or: [{userIdSender: userId1, userIdReceiver: userId2},{userIdSender: userId2, userIdReceiver: userId1}]}).sort({dateTimeChat: 1}).toArray(function(err, result){
                if(err){
                    console.log(err);
                    return callback(false);
                } else{
                    return callback(result);
                }
            });
        });
    });
}
exports.getListUserChat = function(userIdSender, callback){
    connection.getConnection(function(db){
        db.collection('chat', function(err, collection){
            collection.distinct('userIdReceiver', {userIdSender: userIdSender}, function(err, result){
                console.log(result);
                //getListUserChatDetail(result, function(data){
                //    if(err){
                //        console.log(err);
                //        return callback(false);
                //    } else{
                //        return callback(data);
                //    }
                //});
                //var data = getListUserChatDetail(result);
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    return callback(result);
                }

            });
        });
    });
};
function getListUserChatDetail(arrUserId){
    connection.getConnection(function(db){
        db.collection('user', function(err, collection){
            collection.find({_id: {$in: arrUserId}}, function(err, result){
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    return result;
                }
            });
        });
    })
}