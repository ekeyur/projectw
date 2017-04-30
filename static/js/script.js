$(document).ready(function(){
  $("#menu_button").on("click", function(){
    $("#nav-links-div").toggle();
  })

  setTimeout(function(){
    TweenMax.staggerFrom(".start", 1.5, {y: -500}, 0.25);
  }, 300)

  $(window).scroll(function(event){
    $("#arrow").hide()
  })

  new IdealImageSlider.Slider('#slider');

  $(window).resize(function(){
    console.log("hello")
    var height = $(window).height();
    var width = $(window).width();
    var propotion = width/height;
    if(propotion<1372/912){
      $("#slider").css("top", function(){
        var top = (height-width*2/3)/2;
        return top+"px";
      })
    }else{
      $("#slider").css("top", 0)
    }
  })
})
