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
    //uri:'http://www.appledaily.com.tw/rss/create/kind/rnews/type/new'
    uri:'http://www.appledaily.com.tw/rss'
    , headers: {'User-Agent': 'Mozilla/5.0'}}, function (error, response, html) {
    if (!error && response.statusCode == 200) {
	/*
		parser.write(html);
		parser.end();
	*/
		var $ = cheerio.load(html);

		$('.each_level .inst a').each(function(i, element){
			console.log($(this).html());
			console.log($(this).text());
		});

		$('.each_level .inst_all li').each(function(i, element){
			console.log($(this).html());
			console.log($(this).text());
		});
    }
});

