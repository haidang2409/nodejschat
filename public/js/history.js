/**
 * Created by nguyen hai dang on 08/07/2015.
 */
$(function(){
     $('#view-history').click(function(){
         var data = {
            userId: $('#txt-session-userId').val()
         };
         $.ajax({
             url: '/view-history',
             data: data,
             type: 'POST',
             beforeSend: function(){

             },
             success: function(data){

             },
             complete: function(){

             },
         })
     });
});
