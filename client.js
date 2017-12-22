// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

var get_one_of_fields = function(e, fields) {
  for(i=0;i<fields.length;i++) {
    if(fields[i] in e) {
      return e[fields[i]];
    }
  }
}

var prepare_link = function(e) {
  if(e['Link']) {
    return '<a href="'+e['Link']+'">See more</a>';
  }
}

var prepare_content = function(e) {
  return e['Publication info'];
}

var make_element_large = function(view) {
  if(view.author.length < 20) return true;
  return false;
}

var prepare_category = function(e) {
  return e['Main category'] + ' '+ e['Additional tags'];
}

var get_colour = function(sheet, e) {
  return 'coral';
}

var process_sheet = function(data) {
  var template = $('#template').html();
  Mustache.parse(template);
  data.elements.forEach(function(e) {
    var view = {
      'colour': get_colour(data.name, e),
      'author': get_one_of_fields(e, ['Artist/ Curator', 'Author/ Editor', 'Organisation', 'Director']),
      'title': e['Title'],
      'category': prepare_category(e),
      'link': prepare_link(e),
      'content': prepare_content(e)
    };
    var output = Mustache.render(template, view);
    if(make_element_large(view)) {
      $('.grid').append('<div class="grid-item">'+output+'</div>');
    } else {
      $('.grid').append('<div class="grid-item grid-item--width2x">'+output+'</div>');
    }
  });
}

$(function() {
  console.log('hello world :o');
  var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1MNKnttU9SxjD0AM_xnqqk2WU-mv5qr29mBs5KLYvFrc/edit?usp=sharing';
  Tabletop.init({
    key: publicSpreadsheetUrl,
    callback: function gotData (data, tabletop) {
      tabletop.modelNames.forEach(function(s) {
        process_sheet(data[s]);
      });
      $('.header').each(function (i,a) {
        $(a).bigtext();
      });
      $('.grid').isotope({
        itemSelector: '.grid-item',
      });
    }
  });

//  $.get('sheet', function (data) {
//    // Now use Sheetsee!
//    console.log(Sheetsee)
//    document.getElementById('datafact').innerHTML = 'Back with <b>' + data.length + '</b> rows from the spreadsheet!'
//  })
})
