/**
 * Created by nguyen hai dang on 07/15/2015.
 */
var socket = io();
//Default profile
//var socket = io.connect('http://chat-haidang.rhcloud.com:8000/', {'forceNew':true });
_data = {
    'userId': $('#txt-session-userId').val(),
    'fullname': $('#txt-session-fullname').val(),
    'avatar': $('#txt-session-avatar').val(),
    'sex': $('#txt-session-sex').val(),
};
step = 0;
//Send information when online
socket.emit('userIdOnline', _data);

//Listen all user online
socket.on('AllUserOnline', function(data){
    var html = '';
    if(data.length > 0)
    {
        for(var i = 0; i < data.length; i++)
        {
            if(data[i].userId.toString() != _data.userId.toString());
            {
                html = html + '<a class="btnClickUserChat" style="text-decoration: none" href="javascript: void(0)" data-userId="' + data[i].userId + '" data-fullname="' + data[i].fullname + '" data-avatar="' + data[i].avatar + '">';
                html = html + '<div class="div-user-online" style="text-decoration: none">';
                html = html + '<img class="img-circle" src="./images/user/' + data[i].avatar + '" width="35" height="35">&nbsp;&nbsp;' + data[i].fullname + '</div></a>';
            }
        }
    }
    else
    {
        html = 'Not user online';
    }
    $('#div-list-user-online').html(html);
});
//Logout
$('#btnExit').click(function(){
    socket.emit('userIdOffline', _data);
    window.location = '/logout';
});
//Event click on user online to chat
$(document).on('click', '.btnClickUserChat', function(){
    var userIdOther = $(this).data('userid');
    if(userIdOther != $('#txt-session-userId').val())
    {
        if($('#div-' + userIdOther).length > 0)
        {
            $('#div-' + userIdOther).show();
            $('#txtChatContent-' + userIdOther).focus();
            $('#div-title-chat' + userIdOther).css('background-color', '#D2D2D2');
        }
        else
        {
            var fullnameOther = $(this).data('fullname');
            var avatarOther = $(this).data('avatar');
            $('#div-chat-content').append(getDivChat(userIdOther, fullnameOther, avatarOther));
            $('#txtChatContent-' + userIdOther).focus();
        }
    }
});
//Event close window chat
$(document).on('click', '.btn-close-div-chat', function(){
    var btn = $(this);
    var index = $('.btn-close-div-chat').index(this);
    $('.div-chat:eq(' + index + ')').hide();
});
//Event enter textbox chat
$(document).on('keypress', '.txtChatContent', function(e){
    var code = e.keyCode || e.which;
    if(code == 13)
    {
        e.preventDefault();
        var txt = $(this);
        var index = $('.txtChatContent').index(this);
        var content = $('.txtChatContent:eq(' + index + ')').val();
        $('.txtChatContent:eq(' + index + ')').val('');
        //Send socket
        //Declare user data
        var data = {
            userIdReceiver: $('.txtUserOther:eq(' + index + ')').attr('data-userIdOther'),
            //fullnameReceiver: $('.txtUserOther:eq(' + index + ')').attr('data-fullnameOther'),
            //avatarReceiver: $('.txtUserOther:eq(' + index + ')').attr('data-avatarOther'),
            userIdSender: $('#txt-session-userId').val(),
            fullnameSender: $('#txt-session-fullname').val(),
            avatarSender: $('#txt-session-avatar').val(),
            content: content
        };
        socket.emit('ContentChatSend', data);
        //var div = '<div class="alert-box success"><div style="display: inline-block">' + content + '</div><div class="div-image-sender" style="display: inline-block"><img class="img-circle" src="./images/user/' + $('#txt-session-avatar').val() + '" width="35" height="35"></div></div>';
        var div = '<div class="alert-box success"><div style="display: inline-block">' + content + '</div></div>';
        $('.div-content-messages:eq(' + index + ')').append(div);
        $('.div-content-messages:eq(' + index + ')').animate({ scrollTop: $('.div-content-messages:eq(' + index + ')')[0].scrollHeight}, 1000);
    }
});
//Focus on textbox chat
$(document).on('focus', '.txtChatContent', function(e){
        var txt = $(this);
        var index = $('.txtChatContent').index(this);
        $('.div-title-chat:eq(' + index + ')').css('background-color', '#D2D2D2');
        document.title = 'Chat example';
});
//Blur out textbox chat
$(document).on('blur', '.txtChatContent', function(e){
    var txt = $(this);
    var index = $('.txtChatContent').index(this);
    $('.div-title-chat:eq(' + index + ')').css('background-color', '#DDDDDD');
});
////Click div chat chat
//$(document).on('click', '.div-chat', function(e){
//    var txt = $(this);
//    var index = $('.div-chat').index(this);
//    $('.div-title-chat:eq(' + index + ')').css('background-color', '#899BE2');
//});
////Click div chat chat
//$(document).on('blur', '.div-chat', function(e){
//    var txt = $(this);
//    var index = $('.div-chat').index(this);
//    $('.div-title-chat:eq(' + index + ')').css('background-color', '#DDDDDD');
//});
socket.on('ResponseContentChat', function(data){
    var userIdReceiver = data.userIdReceiver;
    var userIdSender = data.userIdSender;
    if(userIdSender != $('#txt-session-userId').val())
    {
        if(userIdReceiver == $('#txt-session-userId').val())
        {
            if($('#div-' + userIdSender).length > 0)
            {
                $('#div-' + userIdSender).show();
                var div = '<div class="alert-box warning"><img class="img-circle" src="./images/user/' + data.avatarSender + '" width="35" height="35">&nbsp;&nbsp;' + data.content + '</div>'
                $('#div-content-messages-' + userIdSender).append(div);
                $('#txtChatContent-' + userIdSender).focus();
                //$('#div-title-chat' + userIdSender).css('background-color', '#99B7D4');
                //document.title = data.fullnameSender + ' has sent new message';
                step = 0;
                flash_title();
                effectDivNewMess($('#div-title-chat' + userIdSender));
            }
            else
            {
                var fullnameOther = data.fullnameSender;
                var userIdOther = data.userIdSender;
                var avatarOther = data.avatarSender;
                var div = '	<div class="alert-box warning"><img class="img-circle" src="./images/user/' + data.avatarSender + '" width="35" height="35">&nbsp;&nbsp;' + data.content + '</div>'
                $('#div-chat-content').append(getDivChat(userIdOther, fullnameOther, avatarOther));
                $('#div-content-messages-' + userIdOther).append(div);
                $('#txtChatContent-' + userIdOther).focus();
                //$('#div-title-chat' + userIdSender).css('background-color', '#99B7D4');
                //document.title = data.fullnameSender + ' has sent new message';
                flash_title();
                effectDivNewMess($('#div-title-chat' + userIdSender));
            }
        }
    }
});
$(document).on('keyup', '.txtChatContent', function(){
    var txt = $(this);
    var index = $('.txtChatContent').index(this);
    var content = $('.txtChatContent:eq(' + index + ')').val();
    if(content != '')
    {
        var data = {
            userIdReceiver: $('.txtUserOther:eq(' + index + ')').attr('data-userIdOther'),
            userIdSender: $('#txt-session-userId').val(),
            fullnameSender: $('#txt-session-fullname').val(),
            status: 'is typing'
        };
        socket.emit('UserIsTyping', data);
    }
    else
    {
        var data = {
            userIdReceiver: $('.txtUserOther:eq(' + index + ')').attr('data-userIdOther'),
            userIdSender: $('#txt-session-userId').val(),
            fullnameSender: $('#txt-session-fullname').val(),
            status: 'no typing'
        };
        socket.emit('UserIsTyping', data);
    }

});
socket.on('ResponseUserTyping', function(data){
    var userIdReceiver = data.userIdReceiver;
    var userIdSender = data.userIdSender;
    var fullnameSender = data.fullnameSender;
    if(data.status == 'is typing')
    {
        if(userIdSender != $('#txt-session-userId').val())
        {
            if(userIdReceiver == $('#txt-session-userId').val())
            {
                if($('#div-' + userIdSender).length > 0)
                {
                    $('#div-' + userIdSender).show();
                    var div = fullnameSender + ' is typing'
                    $('#div-is-typing-' + userIdSender).html(div);
                }
            }
        }
    }
    else
    {
        $('#div-is-typing-' + userIdSender).html('');
    }
});
function getDivChat(userId, fullname, avatar){
    var divChat = '';
    divChat = '<div class="div-chat" id="div-' + userId + '">';
    divChat = divChat + '<div class="div-title-chat" id="div-title-chat' + userId + '">';
    divChat = divChat + '<div class="div-fullname-user"><b>' + fullname;
    divChat = divChat + '</b></div>';
    divChat = divChat + '<div class="div-btn-close" style="display: inline-block">';
    divChat = divChat + '<button class="btn-close-div-chat"><span class="glyphicon glyphicon-remove"></span></button>';
    divChat = divChat + '</div>';
    divChat = divChat + '</div>';
    divChat = divChat + '<div class="div-content-messages" id="div-content-messages-' + userId + '">';
    divChat = divChat + '</div>';
    divChat = divChat + '<div class="div-is-typing" id="div-is-typing-' + userId + '">';
    divChat = divChat + '</div>';
    divChat = divChat + '<div id="div-text-chat">';
    divChat = divChat + '<textarea class="txtChatContent" id="txtChatContent-' + userId + '" style="width: 264px; height: 43px; resize: none"></textarea>';
    divChat = divChat + '<input type="hidden" class="txtUserOther" data-userIdOther="' + userId + '" data-fullnameOther="' + fullname + '" data-avatarOther="' + avatar + '"></div>';
    divChat = divChat + '</div>';
    return divChat;
}
//
function effectDivNewMess(selector){
    for(var i = 0; i < 10; i++)
    {
        selector.css("background-color", "red");
        selector.css("background-color", "blue");
        setTimeout(function(){
            //selector.css("background-color", "blue");
        }, 1000);
    }
}
function flash_title(t1, t2){
    step ++;
    if(step == 3)
    {
        step = 1;
    }
    if(step == 1)
    {
        document.title = t1;
    }
    if(step == 2)
    {
        document.title = t2;
    }
    setTimeout("flash_title()",2000);
}
