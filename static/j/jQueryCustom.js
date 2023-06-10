
jQuery( document ).ready(function( $ ) {







  $('.switchSide').click(function () {

    if($("body").hasClass("evil") === true) {
      $("body").removeClass("evil").addClass("good");
      $(".switchSide .evil").fadeOut(200);
      $(".switchSide .good").fadeIn(200);
    } else {
      $("body").removeClass("good").addClass("evil");
      $(".switchSide .good").fadeOut(200);
      $(".switchSide .evil").fadeIn(200);
    }

  });



});
