var util = require('util');
var fs = require('fs');
var async = require('async');
var request = require("request");
var fs = require('fs');

var tts = {};
tts.speak = function(text, lang, doneCB) {

	if (typeof lang == 'undefined' || !lang)
		lang = "en";

	console.log("The text to be spoken is '" + text + "', length is " + text.length);

	if (text.length > 80) {
		// call queue function.
		this.speakQueue(text, lang, doneCB);
	} else {

		var spawn = require('child_process').spawn;
		//var child = spawn('/usr/bin/mpg123',['-']);
		//var child = spawn('/usr/bin/madplay',['-']);

		// Perry: Not sure the reason but -af=lavcresample=48000 works on my raspberry2.
		var child = spawn('/usr/bin/mplayer', ['-cache', '8192', '-', '-really-quiet', '-framedrop', '-af', 'lavcresample=48000']);
		var url = "http://translate.google.com/translate_tts?tl=" + lang + "&q=" + encodeURIComponent(text);
		var r = request({
			uri: url,
			headers: {
				'User-Agent': 'Mozilla/5.0'
			}
		});

		console.log(url);

		r.on('error', function(err) {
			console.log(err);
		});

		r.on('complete', function(e) {
			console.log("complete");
		});

		r.on('response', function(response) {
			if (response.statusCode !== 200) {
				console.log(response.statusCode); // 200 
				console.log(response.headers);
			}
		});

		child.on('exit', function(code, signal) {
			console.log("exit");

			// Delay one second to play next news.
			setTimeout(function() {
				doneCB();
			}, 1000);
		});

		r.pipe(child.stdin);
	}
}

function padLeft(str, len) {
	str = '' + str;
	if (str.length >= len) {
		return str;
	} else {
		return padLeft("0" + str, len);
	}
}

function arraySplit(text, lang) {
	var tmpStr = "";
	var firstList;
	var resultList = [];
	var splitList = [];
	var index = 0;

	if (lang == "en") {
		// Remove " " and "'" from the split keyword
		firstList = text.split(/[\(\)\[\],.?!+^_\-`\"\%<>\|/\\@#$&*;:]|\r\n|\r|\n/);
	} else {
		firstList = text.split(/[\(\)\[\],.?!+^_\-`\"\%<>\|/\\@#$&*;:' ]|[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b\uff01]|\r\n|\r|\n/);
	}

	for (var i = 0; i < firstList.length; i++) {
		if (firstList[i].length > 80) {
			var pos = firstList[i].indexOf(" ", 40);
			splitList.push(firstList[i].substring(0, pos));
			splitList.push(firstList[i].substring(pos, firstList[i].length));
		} else {
			splitList.push(firstList[i]);
		}
	}

	for (var i = 0; i < splitList.length; i++) {
		if (splitList[i].length === 0)
			continue;
		if (tmpStr.length === 0) {
			tmpStr = splitList[i];
			continue;
		}

		if (tmpStr.length + splitList[i].length > 80) {
			resultList.push({
				index: index,
				text: tmpStr
			});
			index++;
			tmpStr = splitList[i];
		} else {
			tmpStr = tmpStr + " " + splitList[i];
		}
	}
	if (tmpStr.length !== 0)
		resultList.push({
			index: index,
			text: tmpStr
		});

	return resultList;
}

tts.uniqueId = 0;

tts.speakQueue = function(text, lang, doneCB) {

	if (typeof lang == 'undefined' || !lang)
		lang = "en";

	var filePrefix = process.cwd() + "/sound/voice_" + tts.uniqueId + "_";
	var textArray = arraySplit(text, lang);

	console.log(util.inspect(textArray));

	async.each(textArray, function(obj, cb) {
		var mp3File = fs.createWriteStream(filePrefix + padLeft(obj.index, 3) + ".mp3");
		var url = "http://translate.google.com/translate_tts?tl=" + lang + "&q=" + encodeURIComponent(obj.text);
		var r = request({
			uri: url,
			headers: {
				'User-Agent': 'Mozilla/5.0'
			}
		});
		console.log(url);

		r.on('error', function(err) {
			cb(err);
		});

		r.on('complete', function(e) {
			console.log("Index: " + obj.index + " is complete");
			cb();
		});

		r.on('response', function(response) {
			if (response.statusCode !== 200) {
				console.log(response.statusCode); // 200 
				console.log(response.headers);
				cb(response.statusCode);
			}
		});

		r.pipe(mp3File);
	}, function(err) {
		//var child = spawn('/usr/bin/mplayer',[process.cwd+"/*.mp3"]);
		var exec = require('child_process').exec;
		// Perry: be care of theNode.js's  buffer size limitation
		var child = exec('/usr/bin/mplayer -really-quiet -slave -framedrop -af lavcresample=48000 ' + filePrefix + '*.mp3', function(error, stdout, stderr) {
			if (error)
				console.log(error);
			console.log("all are complete");
			exec('rm -rf ' + filePrefix + '*.mp3');

			doneCB();
		});
	});
}

module.exports = tts;
