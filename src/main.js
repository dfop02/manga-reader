let current_page_number = 0;
let current_size = 60;
let current_style = 'vertical-style';
let total_pages = 67;
let manga_name = 'rawkuma';

function collect_pages(total_pages=0) {
  let pages = [];
  for (let page in [...Array(total_pages).keys()]) {
    pages.push(`manga/${page}.${manga_name}.com.jpg`);
  }

  $('.page-number span.total').html(total_pages);

  return pages;
}

function show_image(id='', src='', width=current_size) {
  $('.page').append(`<img id="${id}" width="${width}%" src="${src}"/>`)
}

function update_page_size(new_size) {
  $('.page img').each(function(){
    $(this).attr('width', `${new_size}%`);
  });

  if ($('#pageSize').val() != new_size) {
    $('#pageSize').val(new_size)
  }
}

function show_pages_by_style(style) {
  let pages = $('.page img');

  if (style == 'one-page-style') {
    pages.each(function() {
      console.log(`id: ${parseInt(this.id)} | current_page_number: ${current_page_number}`)
      if (parseInt(this.id) != current_page_number) {
        $(this).hide();
      } else {
        $(this).show();
      }
    });
  } else if (style == 'double-page-style') {
    pages.each(function() {
      if (parseInt(this.id) != current_page_number && parseInt(this.id) != current_page_number+1) {
        $(this).hide();
      } else {
        $(this).show();
      }
    });
  } else {
    pages.each(function() {
      $(this).show();
    });
  }
}

function toggle_page_buttons(hide=true) {
  if (hide) {
    $('.previous-page-btn, .next-page-btn').hide();
    $('.page-number').hide();
  } else {
    $('.previous-page-btn, .next-page-btn').fadeIn();
    $('.page-number').fadeIn();
  }
}

function switch_style(new_style) {
  let page = $('.page');
  let page_styles = ['one-page-style', 'double-page-style'];

  if (current_style == new_style) return;

  if (page_styles.includes(current_style) && !page_styles.includes(new_style)) {
    toggle_page_buttons(hide=true);
    update_page_size(current_size);
  }

  if (new_style == 'one-page-style') {
    toggle_page_buttons(hide=false);
    update_page_size(current_size);
  } else if (new_style == 'double-page-style') {
    toggle_page_buttons(hide=false);
    update_page_size(50);
  } else if (new_style == 'double-vertical-style') {
    update_page_size(50);
  }

  show_pages_by_style(new_style);
  page.removeClass(current_style);
  page.addClass(new_style);
  current_style = new_style;
}

function joinFullScreen(){
  if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  }
}

function exitFullScreen(){
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function move_page(direction) {
  if (direction == 'right') {
    if (current_page_number < total_pages) {
      if (current_style == 'double-page-style') {
        current_page_number += 2;
      } else {
        current_page_number++;
      }
    }
  } else {
    if (current_style == 'double-page-style') {
      if (current_page_number > 1) {
        current_page_number -= 2;
      }
    } else {
      if (current_page_number > 0) {
        current_page_number--;
      }
    }
  }
  $('.page-number input.current').val(current_page_number);
  show_pages_by_style(current_style);
}

$(function() {
  let pages = collect_pages(total_pages=total_pages);

  for (let [index, page] of pages.entries()) {
    show_image(id=index, src=page);
  }

  // Fullscreen
  let isFullscreen = false;

  $('.fullscreen').click(function() {
    if (isFullscreen) {
      isFullscreen = false;
      exitFullScreen();
    } else {
      isFullscreen = true;
      joinFullScreen();
    }
    $(this).find('span').toggle();
  });

  // Size Page
  $('#pageSize').change(function() {
    update_page_size($(this).val());
  });

  // Page Number
  $('#currentPage').change(function() {
    current_page_number = parseInt($(this).val());
    show_pages_by_style(current_style);
  });

  // Previous and Next Buttons
  $('.previous-page-btn').click(function() {
    move_page('left');
  })

  $('.next-page-btn').click(function() {
    move_page('right');
  })

  $(this).keydown(function(e) {
    if (['one-page-style', 'double-page-style'].includes(current_style)) {
      if (e.keyCode == 37) {
        move_page('left');
      }
      if (e.keyCode == 39) {
        move_page('right');
      }
    }
  });

  // Scroll Button and Header
  let btn = $('#scroll-top');

  $(window).scroll(function() {
    let scrollTop = $(this).scrollTop();
    let controls = $('.controls');

    if (['vertical-style', 'double-vertical-style'].includes(current_style)) {
      if (scrollTop > 300) {
        btn.fadeIn(1000);
        controls.addClass('fixed');
      } else {
        btn.fadeOut(1000);
        controls.removeClass('fixed');
      }
    } else {
      if (controls.hasClass('fixed')) {
        btn.fadeOut(1000);
        controls.removeClass('fixed');
      }
    }
  });

  btn.click(function(e) {
    e.preventDefault();
    $('html, body').animate({scrollTop:0}, '300');
  });
});
