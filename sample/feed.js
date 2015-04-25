var request = require('request');
var htmlparser = require("htmlparser2");

var handler = new htmlparser.FeedHandler(function (error, feed) {
    if (error)
		console.log(err)
    else {
		console.log(feed.title);
		console.log("There are " + feed.items.length + " items");
		for(var i = 0; i < feed.items.length; i++)
			console.log(i + " " + feed.items[i].title);
	}
});

var parser = new htmlparser.Parser( handler, {
	decodeEntities: true,
	xmlMode: true
});

request({
    //uri:'http://www.appledaily.com.tw/rss/create/kind/rnews/type/new'
    uri:'http://www.appledaily.com.tw/rss/create/kind/rnews/type/117'
    , headers: {'User-Agent': 'Mozilla/5.0'}}, function (error, response, html) {
    if (!error && response.statusCode == 200) {
		parser.write(html);
		parser.end();
    }
});

