let current_page_number = 0;
let total_pages = 68;
let manga_name = 'rawkuma';

function collect_pages(total_pages=0) {
  let pages = [];
  for (let page in [...Array(total_pages).keys()]) {
    pages.push(`manga/${page}.${manga_name}.com.jpg`);
  }
  return pages;
}

function show_image(id='', src='', width='60') {
  $('.page').append(`<img id="${id}" width="${width}%" src="${src}"/>`)
}

function update_page_size(new_size) {
  $('.page img').each(function(){
    $(this).attr('width', `${new_size}%`);
  });
}

function get_current_style() {
  return $('.page').attr('class').split(' ')[1];
}

function switch_style(new_style) {
  let page          = $('.page');
  let current_style = get_current_style();

  if (current_style == new_style) return;

  if (current_style == 'page-style') {
    $('.previous-page-btn, .next-page-btn').fadeOut().hide();
    $('.page img').each(function() {
      $(this).show();
    });
  }

  if (new_style == 'page-style') {
    $('.previous-page-btn, .next-page-btn').show().fadeIn();;
    $('.page img').each(function() {
      if (parseInt(this.id) != current_page_number) {
        $(this).hide();
      };
    });
  }

  page.removeClass(current_style);
  page.addClass(new_style);
}

function move_page(direction) {
  if (direction == 'right') {
    if (current_page_number < total_pages) {
      $(`.page img#${current_page_number}`).hide();
      $(`.page img#${current_page_number+1}`).show();
      current_page_number++;
    }
  } else {
    if (current_page_number > 0) {
      $(`.page img#${current_page_number}`).hide();
      $(`.page img#${current_page_number-1}`).show();
      current_page_number--;
    }
  }
}

$(function() {
  let pages = collect_pages(total_pages=total_pages);

  for (let [index, page] of pages.entries()) {
    show_image(id=index, src=page);
  }

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
    if (get_current_style() == 'page-style') {
      if (e.keyCode == 37) {
        move_page('left');
      }
      if (e.keyCode == 39) {
        move_page('right');
      }
    }
  });

  // Scroll Button
  let btn = $('#scrollTop');

  $(window).scroll(function() {
    if ($(this).scrollTop() > 300) {
      btn.show().fadeIn();
    } else {
      btn.fadeOut().hide();
    }
  });

  btn.click(function(e) {
    e.preventDefault();
    $('html, body').animate({scrollTop:0}, '300');
  });
});
