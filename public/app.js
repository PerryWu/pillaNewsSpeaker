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
	function ajaxReqRssList(service, urlPath) {
		showLoading();
		$.ajax( {
			url: urlPath,
			method: 'GET',
			timeout: 10000})
		.done(function(data) {
			hideLoading();
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
			var liEntry = $('<li>').html('<a href="#titleListPage">' + items[i].category + '</a>');

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
		$("#titleListPageHeaderMSg").text(category);
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
	});

})(jQuery);

