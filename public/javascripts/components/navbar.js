var navbar_fixed = false;

$(window).scroll(() => { 
  var scroll = $(window).scrollTop();

  if (scroll >= 97 && !navbar_fixed) {
    setNavbarFixed(true);
  } else if (scroll < 97 && navbar_fixed) {
    setNavbarFixed(false);
  }
});

function setNavbarFixed(to) {
  if (to) {
    $('#tpech__navbar_list').css({
      'position': 'fixed',
      'top': '0',
      'z-index': '9999',
      'width': '100%'
    });
    $('body').css('padding-top', '48px');
  } else {
    $('#tpech__navbar_list').css({
      'position': '',
      'top': '',
      'z-index': '',
      'width': ''
    });
    $('body').css('padding-top', '');
  }

  navbar_fixed = !navbar_fixed;
}