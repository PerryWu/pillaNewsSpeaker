var request = require('request');
var htmlparser = require("htmlparser2");
var cheerio = require('cheerio');
var util = require('util');

/*
var handler = new htmlparser.DomHandler(function (error, feed) {
    if (error)
		console.log(err)
    else {
		console.log(util.inspect(feed));
	}
});

var parser = new htmlparser.Parser( handler, {
	decodeEntities: true,
	xmlMode: false
});
*/

request({
    //uri:'http://www.appledaily.com.tw/rss'
    uri:'http://edition.cnn.com/services/rss/'
    , headers: {'User-Agent': 'Mozilla/5.0'}}, function (error, response, html) {
    if (!error && response.statusCode == 200) {

		var $ = cheerio.load(html);

		$('tr td.cnnRSS:first-child').each(function(i, element){
			console.log($(this).text());
			//var next = $(this).next().next().children();
			var next = $(this).siblings('.cnnRSS').children();
			console.log($(next).attr('href'));
		});
    }
});

