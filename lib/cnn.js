var async = require('async');
var request = require("request");
var request = require('request');
var htmlparser = require("htmlparser2");
var cheerio = require('cheerio');
var util = require('util');

var cnn = {};

var cnnURL="http://edition.cnn.com/services/rss/";

cnn.getRssList = function (req, res) {

	var rssList = [];

	request({
		uri: cnnURL
		, headers: {'User-Agent': 'Mozilla/5.0'}}, 
		function (error, response, html) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(html);

				$('tr td.cnnRSS:first-child').each(function(i, element){
					var next = $(this).siblings('.cnnRSS').children();
					rssList.push({category: $(this).text(), link: $(next).attr("href")});
				});
				res.json(rssList);
			} else {
				res.statusCode = 404;
				res.json({status: 'error', message: 'fail to request'});
			}
		});
};

cnn.getTitleList = function (req, res) {
	var rssLink = req.query.link;
	if(typeof(rssLink) === "undefined") {
		res.statusCode = 404;
		return res.json({status: 'error', message: 'did not give the link '});
	}
	console.log("RSS link is " + rssLink);

	request({
    	uri: rssLink
	    , headers: {'User-Agent': 'Mozilla/5.0'}}, function (error, response, html) {
		    if (!error && response.statusCode == 200) {
				var titleList = [];
				var title;
		
				var $ = cheerio.load(html, {decodeEntities: true, xmlMode: true});
				$('image title').each(function(i, element){
					console.log($(this).text());
					title = $(this).text();
				});

				$('item title').each(function(i, element){
					console.log($(this).text());
					titleList.push({title: $(this).text()});
				});

				res.json({rssTitle: title, titleList: titleList});
		    } else {
				res.json({status: 'error', message: 'fail to request'});
			}
	});
}

module.exports = cnn;
