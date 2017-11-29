$(function(){
    //$(window).bind("beforeunload", function() {
    //    return confirm("Do you really want to close?");
    //});
    $('#btnRegister').click(function(){
        var hasError = false;
        //Check full name
        if($('#txtFullName').val() == '' || $('#txtFullName').val().length < 6)
        {
            $('#err-fullname').html('Full name is not empty and minimum 6 character!');
            hasError = true;
        }
        else
        {
            $('#err-fullname').html('');
        }
        //Check birthday
        if($('#txtBirthday').val() == '')
        {
            $('#err-birthday').html('Birthday is not empty!');
            hasError = true;
        }
        else
        {
            if(checkDate($('#txtBirthday').val()) == false)
            {
                $('#err-birthday').html('Birthday is not correct format');
                hasError = true;
            }
            else
            {
                if(kiemtradutuoi($('#txtBirthday').val()) == false)
                {
                    $('#err-birthday').html('You are not enough age!');
                    hasError = true;
                }
                else
                {
                    $('#err-birthday').html('');
                }
            }
        }
        //Check email
        if($('#txtEmail').val() == '')
        {
            $('#err-email').html('Email is not empty!');
            hasError = true;
        }
        else
        {
            if(checkEmail($('#txtEmail').val()) == false)
            {
                $('#err-email').html('Email is not correct format.');
                hasError = true;
            }
            else
            {
                if(checkExistEmail($('#txtEmail').val()) == true)
                {
                    $('#err-email').css('color', 'red');
                    $('#err-email').html('Email existed already, you are not use. Please enter an other email!');
                }
                else
                {
                    $('#err-email').html('');
                }
            }
        }
        //
        if($('#txtPassword').val() == '' || $('#txtPassword').val().length < 6)
        {
            $('#err-password').html('Password is not empty and minimum 6 character!');
            hasError = true;
        }
        else
        {
            $('#err-password').html('');
        }
        //
        if($('#txtPassword').val() != $('#txtPassword2').val())
        {
            $('#err-password2').html('Password is not math!');
            hasError = true;
        }
        else
        {
            $('#err-password2').html('');
        }
        //
        if(hasError == false)
        {
            var user = {
                'fullname': $('#txtFullName').val(),
                'sex': $('#sex').val(),
                'birthday': convertDate($('#txtBirthday').val()),
                'email': $('#txtEmail').val(),
                'password': $('#txtPassword').val()
            };
            $.ajax({
                url : '/register',
                data: user,
                type: 'post',
                beforeSend: function(){
                    var html = '<img src="./images/loading-bar2.gif">';
                    $('#div-form-register').hide();
                    $('#div-form-register').after(html);
                },
                success: function(data) {
                    if(data.status == true)
                    {
                        //alert(data.mess + data.user_id);
                        var html = '';
                        html = html + '<font color="blue" size="6">Next step</font>';
                        html = html + '<br>';
                        html = html + 'We just have sent an email to you.';
                        html = html + '<br>';
                        html = html + 'To active account, please copy the code that we have sent to your email and paste it into textbox bellow';
                        html = html + '<br><br>';
                        html = html + '<input id="txtCodeConfirm" class="form-control"><input type="hidden" id="txtUserId" value="' + data.user_id + '">';
                        html = html + '<div id="err-code" style="color: red; font-style: italic"></div>';
                        html = html + '<button class="btn btn-warning" id="btnConfirmCode">Continue</button>';
                        $('#div-form-register').next().remove();
                        $('#div-form-register').empty();//empty, remove
                        $('#div-form-register').html(html);
                        $('#div-form-register').show();
                    }
                    else
                    {
                        $('#div-form-register').next().remove();
                        $('#div-form-register').show();
                        $('#err-register').html('Has error occur in processing!');
                    }
                },
            });
        }
    });
    //Event keyup email
    //$('#txtEmail').keyup(function(){
    //   var email = $('#txtEmail').val();
    //    if(checkEmail(email) == false)
    //    {
    //        $('#err-email').css('color', 'red');
    //        $('#err-email').html('Email is not correct format!');
    //    }
    //    else
    //    {
    //        if(checkExistEmail(email) == true)
    //        {
    //            $('#err-email').css('color', 'red');
    //            $('#err-email').html('Email existed already, you are not use. Please enter an other email!');
    //        }
    //        else
    //        {
    //            $('#err-email').css('color', 'green');
    //            $('#err-email').html('Email is ready using');
    //        }
    //    }
    //});
    $(document).on('click', '#btnConfirmCode', function(){
        if($('#txtCodeConfirm').val() == '')
        {
            $('#txtCodeConfirm').css('border-color', 'red');
        }
        else
        {
            $('#txtCodeConfirm').css('border-color', '');
            $.ajax({
                url: '/active_key_account',
                data: {
                    'key': $('#txtCodeConfirm').val(),
                    'userId': $('#txtUserId').val()
                },
                type: 'post',
                beforeSend: function(){
                    $('#btnConfirmCode').attr('disabled', true);
                },
                success: function(data){
                    if(data.status == false)
                    {
                        $('#err-code').html(data.mess);
                        $('#btnConfirmCode').removeAttr('disabled');
                    }
                    else
                    {
                        location.href = '/';
                    }
                },
            })
        }
    });
    $(document).on('focus', '#txtCodeConfirm', function(){
        $('#txtCodeConfirm').css('border-color', '');
        $('#err-code').html('');
    });
    ///Login
    $('#btnLogin').click(function(){
        var hasError = false;
        if($('#txtEmail-login').val() == '')
        {
            $('#err-email-login').html('Please input email');
            hasError = true;
        }
        else
        {
            $('#err-email-login').html('');
        }
        if($('#txtPassword-login').val() == '')
        {
            $('#err-password-login').html('Please input password');
            hasError = true;
        }
        else
        {
            $('#err-password-login').html('');
        }
        //
        if(hasError == false)
        {
            $.ajax({
                url: '/login',
                data: {
                    email: $('#txtEmail-login').val(),
                    password: $('#txtPassword-login').val()
                },
                type: 'post',
                beforeSend: function(){

                },
                success: function(data){
                    if(data.status == false)
                    {
                        if(data.mess == 'notactive')
                        {
                            var html = '';
                            html = html + '<font color="blue" size="6">Next step</font>';
                            html = html + '<br>';
                            html = html + 'We just have sent an email to you.';
                            html = html + '<br>';
                            html = html + 'To active account, please copy the code that we have sent to your email and paste it into textbox bellow';
                            html = html + '<br><br>';
                            html = html + '<input id="txtCodeConfirm" class="form-control"><input type="hidden" id="txtUserId" value="">';
                            html = html + '<div id="err-code" style="color: red; font-style: italic"></div>';
                            html = html + '<button class="btn btn-warning" id="btnConfirmCode">Continue</button>';
                            $('#div-form-login').empty();
                            $('#div-form-login').html(html)
                        }
                        else
                        {
                            $('#err-password-login').html(data.mess);
                        }
                        ;
                    }
                    else
                    {
                        location.reload();
                    }
                },
            })
        }
    })
});
//
//Function
function checkExistEmail(email){
    var result = false;
    $.ajax({
        url: '/check_exist_email',
        data: {'email': email},
        type: 'post',
        beforeSend: function(){

        },
        success: function(status){
            result = status;
        },
        complete: function(){

        },
        async: false
    });
    return result;
}

