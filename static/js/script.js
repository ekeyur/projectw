$(document).ready(function(){
  var height = $(window).height();
  var width = $(window).width();
  var propotion = width/height;

  $("#menu_button").on("click", function(){
    $("#nav-links-div").toggle();
  })

  setTimeout(function(){
    TweenMax.staggerFrom(".start", 1.5, {y: -500}, 0.25);
  }, 300)

  $(window).scroll(function(event){
    $("#arrow").hide()
  })

  if(width<500){
    $(".nav-links-button").on("click", function(){
      $("#nav-links-div").hide();
    })
  }

  new IdealImageSlider.Slider('#slider');

})
