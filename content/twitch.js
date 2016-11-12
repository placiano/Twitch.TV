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
		url: 'https://api.twitch.tv/kraken/games/top',
		type: 'GET',
		data: {
			client_id: '7zclzcxtiqcxfspf9ltnwztf8kvruwj',
			limit: 100,
			offset: 0
		},
		beforeSend: function(e, d) {
			$("#twitch-loader").show();
		},
		error: function(e) {
			$("#twitch-error").append("<h2>" + e.status + ": " + e.statusText + "</h2>");
			$("#twitch-error").show();
			$("#twitch-loader").hide();
		},
		contentType: 'application/json',
		dataType: 'jsonp',
		success: function(data) {
			$.each(data.top, function(index, value){
				var game_id = value.game._id;
				var game_name = value.game.name;
				var game_image = value.game.box.medium;
				var game_viewers = value.viewers;
				var html = "<div class='game_item' name='" + game_name + "' id='" + game_id + "' tabindex='-1'>";
				html += "<img src='" + game_image + "'>";
				html += "<div class='stream_title'>" + game_name + "</div>";
				html += "<div class='game_status'>" + game_viewers + " viewers</div>";
				html += "</div>";

				$("#twitch-widget-gamelist").append(html);

			})
			rcuNavigator.update();
			$("#twitch-loader").hide();
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

	$.ajax({
		url: 'https://api.twitch.tv/kraken/streams',
		type: 'GET',
		data: {
			client_id: '7zclzcxtiqcxfspf9ltnwztf8kvruwj',
			game: game,
			limit: 100
		},
		beforeSend: function(e, d) {
			$("#twitch-loader").show();
		},
		error: function(e) {
			$("#twitch-error").append("<h2>" + e.status + ": " + e.statusText + "</h2>");
			$("#twitch-error").show();
			$("#twitch-loader").hide();
		},
		contentType: 'application/json',
		dataType: 'jsonp',
		success: function(data) {

			$.each(data.streams, function(index, value){
				var html = "<div class='stream_img' tabindex='-1'>";
				html += "<a href='#' name='" + value.channel.name + "' id='" + value._id + "'><img src='" + value.preview.medium + "'></a>";
				html += "<div class='stream_title'>" + value.channel.status + "</div>";
				html += "<div class='game_status'>" + value.viewers + " viewers on " + value.channel.display_name + "</div>";
				html += "</div>";
				$("#twitch-widget-streamlist").append(html);
			});
			rcuNavigator.update();
			$("#twitch-loader").hide();
		}
	});
}
