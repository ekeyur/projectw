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

  if(propotion<1372/912){
    $("#slider_wrapper").css("top", function(){
      var top = (height-width*2/3)/2;
      return top+"px";
    })
  }else{
    $("#slider").css("top", 0)
  }

  $(window).resize(function(){
    var height = $(window).height();
    var width = $(window).width();
    var propotion = width/height;
    if(propotion<1372/912){
      $("#slider_wrapper").css("top", function(){
        var top = (height-width*2/3)/2;
        return top+"px";
      })
    }else{
      $("#slider").css("top", 0)
    }
  })
})
