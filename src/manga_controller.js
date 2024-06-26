// Default Settings
const page_styles = ['one-page-style', 'double-page-style'];
const vertical_styles = ['vertical-style', 'double-vertical-style'];
let current_page_number = 0;
let current_size = 60;
let current_style = 'vertical-style';
let total_pages = 0;
let manga_name = 'Manga Reader Example';
let filenames = 'example.jpg';
let source = 'manga'
// End Settings

function range(size, startAt = 0) {
  return [...Array(size).keys()].map(i => i + startAt);
}

function collect_pages(total_pages = 0, pages_path = []) {
  if (pages_path.length) return pages_path;

  return range(total_pages).map(page => `${source}/${page}.${filenames}`);
}

function show_image(id = '', src = '', width = current_size) {
  $('.page').append(`<img id="${id}" width="${width}%" src="${src}"/>`);
}

function loadManga(manga_name, source = []) {
  total_pages = source.length;
  const pages = collect_pages(total_pages=total_pages, pages_path=source);

  $('.page').empty();
  for (let [index, page] of pages.entries()) {
    show_image(id=index, src=page);
  }

  generate_carousel();

  $('.manga-title').html(manga_name);
  $('.page-number span.total').html(total_pages-1);
  $('.manga-box, .carousel-pages').show();
}

function generate_carousel() {
  // Clear and fill new pages
  $('.carousel-pages').empty();
  for (let page in range(total_pages)) {
    $('.carousel-pages').append(`<span id="page${page}">${page}</span>`);
  }

  // Remove all eventListener by cloning element
  document.querySelectorAll(".carousel-pages").forEach((carousel) => {
    const new_carousel = carousel.cloneNode(true);
    carousel.parentNode.replaceChild(new_carousel, carousel);
  });

  // Move user to selected page
  $('.carousel-pages span').click(function(e) {
    e.preventDefault();
    let number = $(this).html();
    current_page_number = parseInt(number);
    vertical_jump_to_page()
  });

  // Drag scroll to move between hidden pages
  document.querySelectorAll(".carousel-pages").forEach((elem) => {
    let isDrag = false;
    
    const dragStart = () => isDrag = true;
    const dragEnd = () => isDrag = false;
    const drag = (ev) => isDrag && ((elem.scrollLeft -= ev.movementX) || (elem.scrollLeft += ev.movementX));

    elem.addEventListener("pointerdown", dragStart);
    addEventListener("pointerup", dragEnd);
    addEventListener("pointermove", drag);
  });
}

function mark_page_as_read(page_numbers = [], next_page = true) {
  for (let number of page_numbers.values()) {
    $(`#page${number}`).addClass('read');
  }

  if (next_page) {
    current_page_number++;
    $('.page-number input.current').val(current_page_number);
  }
}

function update_page_size(new_size) {
  $('.page img').attr('width', `${new_size}%`);

  if ($('#pageSize').val() != new_size) {
    $('#pageSize').val(new_size);
  }
}

function show_pages_by_style(style) {
  let pages = $('.page img');

  if (style == 'one-page-style') {
    $(`#${current_page_number}`).show();
    pages.not(`#${current_page_number}`).hide();
  } else if (style == 'double-page-style') {
    $(`#${current_page_number}`).show();
    $(`#${current_page_number + 1}`).show();
    pages.not(`#${current_page_number}`).not(`#${current_page_number + 1}`).hide();
  } else {
    pages.show();
  }
}

function vertical_jump_to_page() {
  console.log('page number: ' + current_page_number);
  $('html, body').animate({
    scrollTop: $(`#${current_page_number}`).offset().top
  }, 500);
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
  const page = $('.page');

  if (current_style == new_style) return;

  if (page_styles.includes(current_style) && !page_styles.includes(new_style)) {
    toggle_page_buttons();
    update_page_size(current_size);
  }

  if (new_style == 'one-page-style') {
    toggle_page_buttons(false);
    update_page_size(current_size);
  } else if (new_style == 'double-page-style') {
    toggle_page_buttons(false);
    update_page_size(50);
  } else if (new_style == 'double-vertical-style') {
    update_page_size(50);
  }

  show_pages_by_style(new_style);
  page.removeClass(current_style);
  page.addClass(new_style);

  if (vertical_styles.includes(current_style) && vertical_styles.includes(new_style)) {
    vertical_jump_to_page();
  }

  current_style = new_style;
}

function join_full_screen() {
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

function exit_full_screen() {
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

function switch_mode(isDarkMode) {
  $('html').toggleClass('dark-mode');
  $('.manga-box').toggleClass('dark-mode');
}

function move_page(direction) {
  if (direction == 'right') {
    if (current_page_number >= total_pages-1) return;

    if (current_style == 'double-page-style') {
      mark_page_as_read([current_page_number, current_page_number+1], false);
      current_page_number += 2;
    } else {
      mark_page_as_read([current_page_number], false);
      current_page_number++;
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

function invalidPage(page) {
  if (page < 0 || page >= total_pages) {
    alert('Invalid Page number');
    return true
  }
  return false
}

function backChapterControl() {
  // Back to Chapters
  $('.back-to-chapters').click(function() {
    $('.manga-box, .carousel-pages').hide();
    renderFolder();
  });
}

function sizePageControl() {
  // Size Page
  $('#pageSize').change(function() {
    update_page_size($(this).val());
  });
}

function pageNumberControl() {
  // Page Number
  $('#currentPage').change(function() {
    let page = parseInt($(this).val());
    if (invalidPage(page)) return;

    current_page_number = page;
    show_pages_by_style(current_style);
  });
}

function changePageControl() {
  let isMobile = ( window.innerWidth <= 1000 );

  // Previous and Next Buttons
  $('.previous-page-btn').click(function() {
    move_page('left');
  });

  $('.next-page-btn').click(function() {
    move_page('right');
  });

  $(this).keydown(function(e) {
    if (page_styles.includes(current_style)) {
      if (e.keyCode == 37) {
        move_page('left');
      }
      if (e.keyCode == 39) {
        move_page('right');
      }
    }
  });

  $('.page img').click(function() {
    if (page_styles) {
      move_page('right');
    }
  });

  // Mobile touch
  if (isMobile) {
    $(this).on('touchstart', function(e) {
      let canMovePage = true;
      let swipe = e.originalEvent.touches;
      let start = swipe[0].pageX;

      $(this).on('touchmove', function(e) {
        let contact = e.originalEvent.touches;
        let end = contact[0].pageX;
        let distance = end-start;

        if (canMovePage) {
          if (distance >= 100) {
            move_page('left');
            canMovePage = false;
          }
          if (distance <= -100) {
            move_page('right');
            canMovePage = false;
          }
        }
      })
      .one('touchend', function() {
        $(this).off('touchmove touchend');
      });
    });
  }
}

function fullscreenControl() {
  // Fullscreen
  let isFullscreen = false;

  $('.fullscreen').click(function() {
    if (isFullscreen) {
      isFullscreen = false;
      exit_full_screen();
    } else {
      isFullscreen = true;
      join_full_screen();
    }
    $(this).find('span').toggle();
  });
}

function switchModeControl() {
  // Switch Mode
  let isDarkMode = false;

  $('.switch-mode').click(function() {
    let mode = $(this).find('p.name-mode');

    if (isDarkMode) {
      isDarkMode = false;
      mode.html('Dark Mode');
    } else {
      isDarkMode = true;
      mode.html('Light Mode');
    }

    $(this).find('span').toggle();
    switch_mode(isDarkMode);
  })
}

function scrollControl() {
// Scroll Button and Header
let btn = $('#scroll-top');

$(window).scroll(function() {
  let scrollTop = $(this).scrollTop();
  let controls = $('.controls');
  let carousel = $('.carousel-pages');

  if (vertical_styles.includes(current_style)) {
    if (scrollTop > 300) {
      btn.fadeIn(1000);
      controls.addClass('fixed');
      carousel.addClass('active');

      if (!$('html,body').is(':animated') && scrollTop > $(`#${current_page_number}`).offset().top) {
        mark_page_as_read([current_page_number]);
      }
    } else {
      btn.fadeOut(1000);
      controls.removeClass('fixed');
      carousel.removeClass('active');
    }
  } else {
    if (controls.hasClass('fixed')) {
      btn.fadeOut(1000);
      controls.removeClass('fixed');
      carousel.removeClass('active');
    }
  }
});

btn.click(function(e) {
  e.preventDefault();
  $('html, body').animate({scrollTop:0}, 300);
});
}

function prepareControls() {
  backChapterControl();
  sizePageControl();
  pageNumberControl();
  changePageControl();
  fullscreenControl();
  switchModeControl();
  scrollControl();
}

$(function() {
  // Booting
  $('.manga-box, .carousel-pages').hide();

  prepareControls();
});
