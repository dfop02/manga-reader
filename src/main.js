let current_page_number = 0;
let current_size        = 60;
let total_pages         = 67;
let manga_name          = 'rawkuma';

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

function get_current_style() {
  return $('.page').attr('class').split(' ')[1];
}

function toggle_page_buttons(hide) {
  if (hide) {
    $('.previous-page-btn, .next-page-btn').fadeOut().hide();
    $('.page-number').fadeOut().hide();
  } else {
    $('.previous-page-btn, .next-page-btn').show().fadeIn();
    $('.page-number').show().fadeIn();
  }
}

function switch_style(new_style) {
  let page          = $('.page');
  let current_style = get_current_style();

  if (current_style == new_style) return;

  if (['page-style', 'double-style'].includes(current_style)) {
    if (!['page-style', 'double-style'].includes(new_style)) {
      toggle_page_buttons(true)
      update_page_size(current_size)
    }
    $('.page img').each(function() {
      $(this).show();
    });
  }

  if (new_style == 'page-style') {
    toggle_page_buttons(false)
    update_page_size(current_size)
    $('.page img').each(function() {
      if (parseInt(this.id) != current_page_number) {
        $(this).hide();
      };
    });
  } else if (new_style == 'double-style') {
    toggle_page_buttons(false)
    update_page_size(50)
    $('.page img').each(function() {
      if (parseInt(this.id) != current_page_number && parseInt(this.id) != current_page_number+1) {
        $(this).hide();
      };
    });
  }

  page.removeClass(current_style);
  page.addClass(new_style);
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
  let current_style = get_current_style();

  if (direction == 'right') {
    if (current_page_number < total_pages) {
      if (current_style == 'double-style') {
        $(`.page img#${current_page_number}`).hide();
        $(`.page img#${current_page_number+1}`).hide();
        $(`.page img#${current_page_number+2}`).show();
        $(`.page img#${current_page_number+3}`).show();
        current_page_number += 2;
      } else {
        $(`.page img#${current_page_number}`).hide();
        $(`.page img#${current_page_number+1}`).show();
        current_page_number++;
      }
    }
  } else {
    if (current_style == 'double-style') {
      if (current_page_number > 1) {
        $(`.page img#${current_page_number}`).hide();
        $(`.page img#${current_page_number-1}`).hide();
        $(`.page img#${current_page_number-2}`).show();
        $(`.page img#${current_page_number-3}`).show();
        current_page_number -= 2;
      }
    } else {
      if (current_page_number > 0) {
        $(`.page img#${current_page_number}`).hide();
        $(`.page img#${current_page_number-1}`).show();
        current_page_number--;
      }
    }
  }
  $('.page-number span.current').html(current_page_number);
}

$(function() {
  let pages = collect_pages(total_pages=total_pages);

  for (let [index, page] of pages.entries()) {
    show_image(id=index, src=page);
  }

  // Fullscreen
  let isFullscreen = false;

  $(".fullscreen").click(function() {
    if (isFullscreen) {
      isFullscreen = false;
      exitFullScreen();
    } else {
      isFullscreen = true;
      joinFullScreen();
    }
  });

  // Size Page
  $('#pageSize').change(function() {
    update_page_size($(this).val());
  });

  // Previous and Next Buttons
  $('.previous-page-btn').click(function() {
    move_page('left');
  })

  $('.next-page-btn').click(function() {
    move_page('right');
  })

  $(this).keydown(function(e) {
    if (['page-style', 'double-style'].includes(get_current_style())) {
      if (e.keyCode == 37) {
        move_page('left');
      }
      if (e.keyCode == 39) {
        move_page('right');
      }
    }
  });

  // Scroll Button
  let btn = $('#scroll-top');

  $(window).scroll(function() {
    if (get_current_style() == 'vertical-style') {
      if ($(this).scrollTop() > 300) {
        btn.show().fadeIn();
      } else {
        btn.fadeOut().hide();
      }
    }
  });

  btn.click(function(e) {
    e.preventDefault();
    $('html, body').animate({scrollTop:0}, '300');
  });
});
