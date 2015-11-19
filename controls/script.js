$(document).ready(function(){
  $('.page-header').hover(function(){
    $('.project-name').hide('slow');
    $('.project-tagline').hide('slow');
  },function(){
    $('.project-name').show('slow');
    $('.project-tagline').show('slow');
  }),
  $('.page-header').hover(function(){
    $('.project-name').hide('slow');
    $('.project-tagline').hide('slow');
  },function(){
    $('.project-name').show('slow');
    $('.project-tagline').show('slow');
  });

  var opacityS = 1;
  var opacitySD = 1;
  $('#opaNull').click(function(){
    $('#header-vid-s').css('opacity', '0');
  }),
  $('#opaFuenfzig').click(function(){
    $('#header-vid-s').css('opacity', '0.5');
  }),
  $('#opaHundert').click(function(){
    $('#header-vid-s').css('opacity', '1');
  }),
  $('#opaNull2').click(function(){
    $('#header-vid-sd').css('opacity', '0');
  }),
  $('#opaFuenfzig2').click(function(){
    $('#header-vid-sd').css('opacity', '0.5');
  }),
  $('#opaHundert2').click(function(){
    $('#header-vid-sd').css('opacity', '1');
  })
})
