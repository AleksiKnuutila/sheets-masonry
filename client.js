// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
  console.log('hello world :o');
  var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1MNKnttU9SxjD0AM_xnqqk2WU-mv5qr29mBs5KLYvFrc/edit?usp=sharing';

  Tabletop.init({
    key: publicSpreadsheetUrl,
    callback: function gotData (data, tabletop) {
      data['Theory'].elements.forEach(function(e) {
        var view = {
          'author': e['Author/ Editor'],
          'title': e['Title']
        };
        var output = Mustache.render('<span class="author">{{ author }}</span> <span class="title">{{ title }}</span>', view);
        $('.grid').append('<div class="grid-item">'+output+'</div>');
      });
			$('.grid').isotope({
				// options
				itemSelector: '.grid-item',
				layoutMode: 'fitRows'
			});
    }
  });

//  $.get('sheet', function (data) {
//    // Now use Sheetsee!
//    console.log(Sheetsee)
//    document.getElementById('datafact').innerHTML = 'Back with <b>' + data.length + '</b> rows from the spreadsheet!'
//  })
})
