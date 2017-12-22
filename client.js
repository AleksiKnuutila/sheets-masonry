var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1MNKnttU9SxjD0AM_xnqqk2WU-mv5qr29mBs5KLYvFrc/edit?usp=sharing';
var types = ["Artwork and exhibitions", "Cinema", "Organisations", "Theory"];

var global_selection;
var global_searchterm;
var type_clicked = function(type) {
  if(global_selection === type) {
    global_selection = '';
    deselect_type(type);
  } else {
    global_selection = type;
    select_type(type);
  }
}

var select_type = function(type) {
  types.forEach(function (t) {
    if(!t===type) $('#button-'+t).toggleClass('button-'+t);
  });
  update_selection();
}

var deselect_type = function(type) {
  types.forEach(function (t) {
    if(!t===type) $('#button-'+t).toggleClass('button-'+t);
  });
  update_selection();
}

var update_selection = function() {
	$('.grid').isotope({ filter: function() {
    if(global_selection) {
      var classes = $(this).attr('class').split(' ');
      if (!classes.includes('grid-'+global_selection)) return false;
		}
    if(global_searchterm) {
  		var c = $(this).find('span').text();
  		c += $(this).find('.title').text();
  		c += $(this).find('.content').text();
  		c += $(this).find('.category').text();
      return c.search(new RegExp(global_searchterm, "i")) != -1;
    }
    return true;
	}});
}

var get_one_of_fields = function(e, fields) {
  for(i=0;i<fields.length;i++) {
    if(fields[i] in e) {
      return e[fields[i]];
    }
  }
}

var get_colour = function(sheet, e) {
  return 'coral';
}

var prepare_classes = function(sheet, e) {
  var classes = 'grid-item';
  if(make_element_large(e)) {
    classes += ' grid-item--width2x';
  }
  switch(sheet) {
    case 'Artwork and exhibitions':
      classes += ' grid-artwork';
      break;
    case 'Theory':
      classes += ' grid-theory';
      break;
    case 'Organisations':
      classes += ' grid-organisations';
      break;
    case 'Cinema':
      classes += ' grid-cinema';
      break;
  }
  return classes;
}

var prepare_link = function(e) {
  if(e['Link']) {
    return '<a href="'+e['Link']+'">See more</a>';
  }
}

var prepare_content = function(e) {
  return e['Publication info'];
}

var make_element_large = function(e) {
  if(prepare_author(e).length > 20) return true;
  return false;
}

var prepare_category = function(e) {
  return e['Main category'] + ' '+ e['Additional tags'];
}

var prepare_author = function(e) {
  return get_one_of_fields(e, ['Artist/ Curator', 'Author/ Editor', 'Organisation', 'Director']);
}

var process_sheet = function(data) {
  var template = $('#template').html();
  Mustache.parse(template);
  data.elements.forEach(function(e) {
    var view = {
      'colour': get_colour(data.name, e),
      'classes': prepare_classes(data.name, e),
      'author': prepare_author(e),
      'title': e['Title'],
      'category': prepare_category(e),
      'link': prepare_link(e),
      'content': prepare_content(e)
    };
    var output = Mustache.render(template, view);
    $('.grid').append(output);
  });
}

$(function() {
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
  window.mdc.autoInit();
	var tfs = document.querySelectorAll(
			'.mdc-text-field:not([data-demo-no-auto-js])'
			);
	for (var i = 0, tf; tf = tfs[i]; i++) {
		mdc.textField.MDCTextField.attachTo(tf);
	}
  $('#searchfield').bind('input', function(){
    global_searchterm = $(this).val();
    update_selection();
	});
})
