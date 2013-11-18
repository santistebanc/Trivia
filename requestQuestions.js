function loadQuestion(url, options) {
		// show loading icon
		$.mobile.showPageLoadingMsg();

		// load book xml file and call showChapter again
		$.getJSON( "questions.json", function( data ) {
		  $.mobile.hidePageLoadingMsg();
		  
		  var items = [];
		  $.each( data, function( key, val ) {
			items.push( "<li id='" + key + "'>" + val + "</li>" );
		  });
		 
		  $( "<ul/>", {
			"class": "my-new-list",
			html: items.join( "" )
		  }).appendTo( "lista" );
		});
	};