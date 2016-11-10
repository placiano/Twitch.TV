var default_limit = 100;

function defineScreen($title){

	$("#game-list-header").text($title);
	$("#twitch-widget-gamelist").empty();
	$("#twitch-widget-streamlist").empty();
	$("#search").val("");
}


function searchChannel(search) {

	defineScreen("Search: " + search)

	  $.ajax({
          url: 'https://api.twitch.tv/kraken/search/streams?limit=100&q=' + search,
          type: 'GET',
          data: {
              client_id: '7zclzcxtiqcxfspf9ltnwztf8kvruwj'
          },
          contentType: 'application/json',
          dataType: 'jsonp',
          success: function(data) {

          	$.each(data.streams, function(index, value){

          		channel_name = value.channel.name
				channel_id = value.channel._id
				channel_image = value.preview.medium
				channgel_display_name = value.channel.display_name
				channel_status = value.channel.status

          		$("#twitch-widget-streamlist").append("<div class='stream_img' tabindex='-1'><a href='#' name='" + channel_name + "' id='" + channel_id + "'><img src='" + channel_image + "'></a><br><b>" + channgel_display_name + "</b><br/><div id='channel_status'>" + channel_status + "</div></div>");

          	})
		rcuNavigator.update();
          }
		});
}

function showGames(){

	defineScreen("All Games")

	 $.ajax({
	          url: 'https://api.twitch.tv/kraken/games/top?limit=' + default_limit +'&offset=0',
	          type: 'GET',
		  data: {
			client_id: '7zclzcxtiqcxfspf9ltnwztf8kvruwj'
		  },

		  error: function(e) {
			$("#twitch-error").append(e.status + ": " + e.statusText);
		  },
	          contentType: 'application/json',
	          dataType: 'jsonp',
	          success: function(data) {

	          	$.each(data.top, function(index, value){
	          		game_id = value.game._id;
	          		game_name = value.game.name;
	          		game_image = value.game.box.medium;
	          		game_viewers = value.viewers;

	          		$("#twitch-widget-gamelist").append("<div class='game_item' name='" + game_name + "' id='" + game_id + "' tabindex='-1'><img src='" + game_image + "'><br><b>" + game_name + "</b><br/><div class='game_status'>" + game_viewers + " viewers</div></div>");

	          	})
			rcuNavigator.update();
	          }
	});

}

function showChannels(){

	defineScreen("Channels")

	$.ajax({
		url: 'https://api.twitch.tv/kraken/streams?limit=100',
		type: 'GET',
                data: {
                    client_id: '7zclzcxtiqcxfspf9ltnwztf8kvruwj'
                },
		contentType: 'application/json',
		dataType: 'jsonp',
		success: function(data) {

			$.each(data.streams, function(index, value){

				channel_name = value.channel.name
				channel_id = value._id
				channel_image = value.preview.medium
				channel_display_name = value.channel.display_name
				channel_viewers = value.viewers
				channel_status = value.channel.status

				$("#twitch-widget-streamlist").append("<div class='stream_img' tabindex='-1'><a href='#' name='" + channel_name + "' id='" + channel_id + "'><img src='" + channel_image + "'></a><br><b>" + channel_display_name + " (" + channel_viewers + " viewers)</b><br/><div id='channel_status'>" + channel_status + "</div></div>");
			})
			rcuNavigator.update();
		}
	});
}

function showStreamers(game){

	defineScreen(game)

	game = game.replace(/\s/g,"+");
	game = game.replace(/\:/g,"%3A");

	$.ajax({
		url: 'https://api.twitch.tv/kraken/streams?game=' + game + '&limit=100',
		type: 'GET',
		data: {
			client_id: '7zclzcxtiqcxfspf9ltnwztf8kvruwj'
		},
	contentType: 'application/json',
	dataType: 'jsonp',
	success: function(data) {

		$.each(data.streams, function(index, value){

		$("#twitch-widget-streamlist").append("<div class='stream_img' tabindex='-1'><a href='#' name='" + value.channel.name + "' id='" + value._id + "'><img src='" + value.preview.medium + "'></a><br><b>" + value.channel.status + "</b><br/><div class='game_status'>" + value.viewers + " viewers on " + value.channel.display_name + "</div></div>");

		})
		rcuNavigator.update();
	}
	});
}
