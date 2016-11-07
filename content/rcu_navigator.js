
var rcuMenuItems = {
	in_charge: 0,
	dropped_out: 0,
	idx: 0,
	count: 0,
	items: {},
	invalidate: function() {
		this.idx = -1;
		this.count = 0;
		this.items.empty();
	},
	update: function() {
		this.items = $("div.left_panel_menu > ul > li > a,\
				div.left_panel > div > input");
		this.count = this.items.length;
	},
	navigate: function(direction) {
		var dropped_out = 0;

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
			/* Release */
			return -1;
			//this.in_charge = 0;
			break;
		case "left":
		case "none":
		default:
			break;
		}

		return this.idx;
	},
	focus: function(idx) {
		this.items.eq(idx).focus();
	}
};

var rcuGameItems = {
	in_charge: 0,
	dropped_out: 0,
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
		var dropped_out = 0;

		this.calc_items_in_row();
		switch (direction) {
		case "right":
			if (!this.idx)
				this.idx++;
			/* I want the cursor run only to the end of the row. */
			else if ((this.idx + 1) % this.nr_items_in_row > 0)
				this.idx++;
			break;
		case "left":
			if (!this.idx)
				return -1;
				//this.in_charge = 0;
			/* I do not want to jump to previous row. */
			else if ((this.idx + 1) % (this.nr_items_in_row + 1) > 0)
				this.idx--;
			else
				//this.in_charge = 0;
				return -1;

			break;
		case "up":
			if ((this.idx - this.nr_items_in_row) >= 0)
				this.idx = this.idx - this.nr_items_in_row;
			break;
		case "down":
			if ((this.idx + this.nr_items_in_row) < this.count)
				this.idx = this.idx + this.nr_items_in_row;
			break;
		case "none":
		default:
			break;
		}

		return this.idx;
	},
	focus: function(idx) {
		this.items.eq(idx).focus();
	}
};

var rcuNavigator = {
	navigate: function(direction) {

		var firstMove = Boolean((rcuGameItems.in_charge == 0) &&
					(rcuMenuItems.in_charge == 0));

		if (firstMove) {
			if (direction == "right") {
				/* Press Right for the first time. Focus first Games
				* list item. */
				rcuGameItems.in_charge = 1;
			} else if (direction == "down") {
				/* Pressed Down for the first time. Focus first Menu
				* item. */
				rcuMenuItems.in_charge = 1;
			}
			direction = "none";
		}

		var n = {};

		if (rcuGameItems.in_charge == 1)
			n = rcuGameItems;
		else
			n = rcuMenuItems;

		var dropped_out = Boolean(n.navigate(direction) < 0);

		if (!dropped_out) {
			n.focus(n.navigate("none"));
			return;
		}


		var t = rcuGameItems.in_charge;
		rcuGameItems.in_charge = rcuMenuItems.in_charge;
		rcuMenuItems.in_charge = t;
		if (rcuGameItems.in_charge == 1)
			n = rcuGameItems;
		else
			n = rcuMenuItems;

		n.focus(n.navigate("none"));
	}
}
