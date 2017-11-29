/**
 * Created by nguyen hai dang on 07/14/2015.
 */
function checkDate(date) {
    re = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    if(date != '')
    {
        if(regs = date.match(re))
        {
            if(regs[1] < 1 || regs[1] > 31)
            {
                return false;
            }
            if(regs[2] < 1 || regs[2] > 12)
            {
                return false;
            }
            if(regs[2] == 2 && regs[1] > 28)
            {
                return false;
            }
            if(regs[3] < 1902 || regs[3] > 2050)
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
}
function kiemtradutuoi(ngaysinh){
    var td = new Date();
    var dateNS = new Date(convertDate(ngaysinh));
    td.setFullYear(td.getFullYear() - 10);
    if(td > dateNS)
    {
        return true;
    }
    else
    {
        return false;
    }
}
function convertDate(date){
    var initial = date.split(/\//);
    return ([ initial[2], initial[1], initial[0] ].join('/'));
}
function checkEmail(email) {
    var isValid = false;
    var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(regex.test(email)) {
        isValid = true;
    }
    return isValid;
}