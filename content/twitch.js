var default_limit = 20;

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

          		$("#twitch-widget-streamlist").append("<div class='stream_img'><a href='#' name='" + channel_name + "' id='" + channel_id + "'><img src='" + channel_image + "'></a><br><b>" + channgel_display_name + "</b><br/><div id='channel_status'>" + channel_status + "</div></div>");
          		
          	})
          }
		});
}

var rcuMenuItems = {
	idx: -1,
	count: 0,
	items: {},
	invalidate: function() {
		this.idx = -1;
		this.count = 0;
		this.items.empty();
	},
	update: function() {
		this.items = $("div.left_panel_menu > ul > li > a");
		this.count = this.items.length;
	},
	navigate: function(direction) {
		switch (direction) {
		case "up":
			if (this.idx > 0)
				this.idx--;
			break;
		case "down":
			if (this.idx < this.count)
				this.idx++;
			break;
		case "right":
		case "left":
			break;
		}
		return this.idx;
	},
	focus: function(idx) {
		this.items.eq(idx).focus();
	}
};

var rcuGameItems = {
	idx: 0,
	count: 0,
	nr_items_in_row: 0,
	items: {},
	invalidate: function() {
		this.idx = -1;
		this.count = 0;
		this.items.empty();
	},
	update: function() {
		this.items = $("div.right_panel > div > div");
		this.count = this.items.length;
	},
	calc_items_in_row: function() {
		var x = $("#twitch-widget-gamelist");
		var y = $("#twitch-widget-gamelist div").first();
		this.nr_items_in_row = x.width() / y.outerWidth(true);
		this.nr_items_in_row = Math.floor(this.nr_items_in_row);
	},
	navigate: function(direction) {
		this.calc_items_in_row();
		switch (direction) {
		case "right":
			if ((this.idx + 1 % this.nr_items_in_row) > 0)
				this.idx++;
			break;
		case "left":
			if ((this.idx % this.nr_items_in_row + 1) > 0)
				this.idx--;
			break;
		case "up":
			if ((this.idx - this.nr_items_in_row) > 0)
				this.idx = this.idx - this.nr_items_in_row;
			break;
		case "down":
			if ((this.idx + this.nr_items_in_row) < this.count)
				this.idx = this.idx + this.nr_items_in_row;
			break;	
		}
		return this.idx;
	},
	focus: function(idx) {
		this.items.eq(idx).focus();
	}
};

var rcu_navigable_items = {};
var rcu_idx = -1;

function rcuItemsUpdate()
{
	rcu_navigable_items = $("a[data-rcu-navigable='true'], div[data-rcu-navigable='true'], input[data-rcu-navigable='true']");
	rcu_idx = -1;
}

function rcuInMenu()
{
	return rcu_idx >= 0 && rcu_idx <= 2;
}

function rcuInGames()
{
	return rcu_idx > 2 && rcu_idx <= 100;
}

function rcuShowFocus()
{
	rcu_navigable_items.eq(rcu_idx).focus();
}

function rcuNavigate(direction)
{
	if (direction == "right" && rcuInMenu()) {
		/* Go to the Games immediately. */
		rcu_idx = 3;
		rcu_navigable_items.eq(rcu_idx).focus();
	} else if (direction == "left" && (rcu_idx + 3) % 6 == 0) {
		rcu_idx = 2;
		rcu_navigable_items.eq(rcu_idx).focus();
	} else if (rcuInMenu()) {
		rcuNavigateInMenu(direction);
		rcuMenuItems.navigate(direction);
	} else {
		rcuNavigateInGames(direction);
		rcuGameItems.navigate(direction);
	}

	return;
}

function rcuNavigateInMenu(direction)
{
	switch (direction) {
	case "up":
		if (rcu_idx > 0)
			rcu_idx--;
		break;
	case "down":
		if (rcu_idx < 2)
			rcu_idx++;
		break;
	case "right":
	case "left":
		break;
	}
}


function rcuNavigateInGames(direction) {
	switch (direction) {
	case "right":
		rcu_idx++;
		break;
	case "left":
		rcu_idx--;
		break;
	case "up":
		rcu_idx = rcu_idx - 6;
		break;
	case "down":
		rcu_idx = rcu_idx + 6;
		break;	
	}
}

function showGames(){
	
	defineScreen("All Games")
	
	 $.ajax({
	          url: 'https://api.twitch.tv/kraken/games/top?limit=' + default_limit +'&offset=0',
	          type: 'GET',
		  data: {
			client_id: '7zclzcxtiqcxfspf9ltnwztf8kvruwj'
		  },
		
		  error: function(a, b, c) {
			console.log(a, b, c);
		  }, 
	          contentType: 'application/json',
	          dataType: 'jsonp',
	          success: function(data) {

	          	$.each(data.top, function(index, value){
	          		game_id = value.game._id;
	          		game_name = value.game.name;
	          		game_image = value.game.box.medium;
	          		game_viewers = value.viewers;
	          		
	          		$("#twitch-widget-gamelist").append("<div class='game_item' data-rcu-navigable='true' name='" + game_name + "' id='" + game_id + "' tabindex='0'><img src='" + game_image + "'><br><b>" + game_name + "</b><br/><div class='game_status'>" + game_viewers + " viewers</div></div>");
	          	
	          	})
			rcu_idx = 3;
			rcu_navigable_items = $("a[data-rcu-navigable='true'], div[data-rcu-navigable='true'], input[data-rcu-navigable='true']");
			rcu_navigable_items.eq(rcu_idx).focus();
			rcuMenuItems.update();
			rcuGameItems.update();
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
				
				$("#twitch-widget-streamlist").append("<div class='stream_img'><a href='#' name='" + channel_name + "' id='" + channel_id + "' data-rcu-navigable='true' tabindex='0'><img src='" + channel_image + "'></a><br><b>" + channel_display_name + " (" + channel_viewers + " viewers)</b><br/><div id='channel_status'>" + channel_status + "</div></div>");
			})
		rcu_navigable_items = $("a[data-rcu-navigable='true'], div[data-rcu-navigable='true'], input[data-rcu-navigable='true']");
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

		$("#twitch-widget-streamlist").append("<div class='stream_img' data-rcu-navigable='true' tabindex='0'><a href='#' name='" + value.channel.name + "' id='" + value._id + "'><img src='" + value.preview.medium + "'></a><br><b>" + value.channel.status + "</b><br/><div class='game_status'>" + value.viewers + " viewers on " + value.channel.display_name + "</div></div>");

		})
	rcu_idx = 3;
	rcu_navigable_items = $("a[data-rcu-navigable='true'], div[data-rcu-navigable='true'], input[data-rcu-navigable='true']");
	rcu_navigable_items.eq(rcu_idx).focus();
	}
	});
}
