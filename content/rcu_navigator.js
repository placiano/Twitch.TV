
var rcuMenuItems = {
	in_charge: 0,
	idx: 0,
	count: 0,
	items: {},

	update: function() {
		this.items = $("div.left_panel_menu > ul > li > a,\
				div.left_panel > div > input");
		this.count = this.items.length;
		this.idx = 0;
		this.in_charge = 0;
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
	idx: 0,
	count: 0,
	nr_rows : 0,
	nr_items_in_row: 0,
	items: {},
	update: function() {
		this.items = $("div.right_panel > div > div");
		this.count = this.items.length;
		this.idx = 0;
		this.in_charge = 0;
	},
	calc_items_in_row: function(which_widget) {
		var x = this.items.first().parent().width();
		var y = this.items.first().outerWidth(true);

		var h = this.items.first().parent().height();
		var h2 = this.items.first().outerHeight(true);

		var h3 = this.items.first().parent();
		var h4 = this.items.first();
		
		this.nr_rows = Math.floor(h / h2);
		this.nr_items_in_row = Math.floor(x / y);
	},
	is_leftmost: function(idx) {
		return Boolean(!idx || 
				!(idx % this.nr_items_in_row))
	},
	navigate: function(direction) {

		this.calc_items_in_row();

		var leftmost = false, rightmost = false;

		/* Possible situation when there is one item
		* per row. */
		if (!this.idx) {
			leftmost = true;
			if (this.nr_items_in_row == 1)
				rightmost = leftmost;
		} else
			leftmost = (this.idx % this.nr_items_in_row) == 0;

		/* It is not the first position in a single columnt layout.
		* Maybe it is the rightmost position? */
		if (!leftmost)
			if (this.idx == this.count - 1)
				rightmost = true;
			else
				rightmost = ((this.idx + 1) % this.nr_items_in_row) == 0;
		

		switch (direction) {
		case "right":
			/* I want the cursor run only to the end of the row. */
			if (!rightmost)
				this.idx++;
			break;
		case "left":
			/* I do not want to jump to previous row. */
			if (!leftmost)
				this.idx--;
			else
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
	update: function() {
		if (rcuMenuItems.count == 0)
			rcuMenuItems.update();
		if (rcuGameItems.count >= 0)
			rcuGameItems.update();
	},
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
