(function($) {

	//
	// Loading
	//
	function showLoading() {
		$("body").addClass('ui-disabled');
		$.mobile.loading( 'show', {
			text: "Loading",
			textVisible: true,
			theme: "b",
			textonly: false,
			html: ""
		});
	}

	function hideLoading() {
		$.mobile.loading("hide");
		$("body").removeClass('ui-disabled');
	}

	//
	// Ajax Actions
	//
	var playStop = 0;
	var playIndex = 1;
	function ajaxReqSpeak() {
		console.log($('#pilla_title_list li').size());
		console.log(playIndex);
		$.ajax( {
			url: '/speak',
			method: 'POST',
			//data: encodeURIComponent(words),
			data: {words:encodeURIComponent($('#pilla_title_list li:nth-child(' + playIndex + ')').text())},
			//contentType: "application/json",
			dataType: 'json',
			timeout: 60000})
		.done(function(data) {
			console.log("done callback. data:" + data);
			if(playStop === 0 && playIndex <= $('#pilla_title_list li').size()) {
				playIndex++;
				ajaxReqSpeak();
			}
		})
		.fail(function(jqXHR, textStatus) {
			console.log("fail callback. xhr:" + textStatus);
			console.log(jqXHR);
		});
	};


	function ajaxReqRssList(service, urlPath) {
		showLoading();
		$.ajax( {
			url: urlPath,
			method: 'GET',
			timeout: 10000})
		.done(function(data) {
			hideLoading();
			$(':mobile-pagecontainer').pagecontainer('change', '#rssPage');
			pillaUpdateRssList(service, data);
		})
		.fail(function(jqXHR, textStatus) {
			hideLoading();
			alert("Error occur while accessing (" + service + ") : " + textStatus);
		});
	};

	function ajaxReqTitleList(urlPath) {
		showLoading();
		$.ajax( {
			url: urlPath,
			method: 'GET',
			timeout: 10000})
		.done(function(data) {
			hideLoading();
			$(':mobile-pagecontainer').pagecontainer('change', '#titleListPage');
			pillaUpdateTitleList(data.rssTitle, data.titleList);
		})
		.fail(function(jqXHR, textStatus) {
			hideLoading();
			alert("Error occur while accessing (" + urlPath + ") : " + textStatus);
		});
	};

	var currentService = "";
	//
	// RSS Page: to update list by given items
	// 
	function pillaUpdateRssList(service, items) {
		$("#pilla_rss_list").empty();
		$("#rssPageHeaderMSg").text(service);
		currentService = service;
		for(i = 0; i < items.length; i++) {
			var liEntry = $('<li>').html('<a href="#">' + items[i].category + '</a>');

			(function (selector, link) {
				var rssLink = link;
				$(selector).on("click", function(e) {
					ajaxReqTitleList("/titleList/" + currentService + "?link=" + rssLink);
				});
			})(liEntry, items[i].link);

			$("#pilla_rss_list").append(liEntry);
		}
		$("#pilla_rss_list").listview('refresh');
	}

	//
	// Title Page: to update list by given items
	// 
	function pillaUpdateTitleList(category, titles) {
		$("#pilla_title_list").empty();
		$("#titleListPageHeaderMsg").text(category);
		for(i = 0; i < titles.length; i++) {
			var liEntry = $('<li data-icon="false">').html('<a href="#">' + titles[i].title + '</a>');
			$("#pilla_title_list").append(liEntry);
		}
		$("#pilla_title_list").listview('refresh');
	}

	$(document).ready(function() {
		$(".pilla_rss_apple").on("click", function(e){
			ajaxReqRssList('apple', "/rssList/apple");
		});
		
		$(".pilla_btn_speak").on("click", function(e){
			ajaxReqSpeak();
		});
	});

})(jQuery);

