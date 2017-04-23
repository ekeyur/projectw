$(document).ready(function(){
  $("#menu_button").on("click", function(){
    $("#nav-links-div").toggle();
  })

  setTimeout(function(){
    TweenMax.staggerFrom(".start", 1.5, {y: -500}, 0.25);
  }, 300)
})
