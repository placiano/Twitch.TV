var rcuMenuItems = {
	idx: 0,
	count: 0,
	items: {},
	update: function() {
		/* This is a menu. It is initialized once and
		* does not get updated. */
		if (this.count > 0)
			return;

		this.items = $(".main > .menu > ul > li > a");
		this.count = this.items.length;
		this.idx = 0;
	},
	navigate: function(direction) {
		switch (direction) {
		case "left":
			if (this.idx > 0)
				this.idx--;
			break;
		case "right":
			if (this.idx < this.count - 1)
				this.idx++;
			break;
		case "down":
			/* A value that means that focus moved
			* to the bottom. */
			return -1;
		case "up":
		case "none":
		default:
			break;
		}

		return this.idx;
	},
	focus: function(idx) {
		var i = idx ? idx : this.idx;
		this.items.eq(i).focus();
	}
};

var rcuGameItems = {
	idx: 0,
	count: 0,
	nr_items_in_row: 0,
	items: {},
	update: function() {
		this.items = $(".main > .container > .gamebox");
		this.count = this.items.length;
		this.idx = 0;
	},
	calc_items_in_row: function() {
		var first_item = this.items.first();
		var x = first_item.parent().width();
		var y = first_item.outerWidth(true);

		this.nr_items_in_row = Math.floor(x / y);
	},
	curr_idx_leftmost: function() {
		var leftmost = false;

		if (!this.idx && (this.nr_items_in_row == 1))
			leftmost = true;
		else
			leftmost = (this.idx % this.nr_items_in_row) == 0;

		return leftmost;
	},
	curr_idx_rightmost: function() {
		var rightmost = false;

		if (!this.idx && (this.nr_items_in_row == 1))
			rightmost = true;
		else if (this.idx == this.count - 1)
			rightmost = true;
		else
			rightmost = ((this.idx + 1) % this.nr_items_in_row) == 0;

		return rightmost;
	},
	navigate: function(direction) {
		this.calc_items_in_row();

		var leftmost = this.curr_idx_leftmost();
		var rightmost = this.curr_idx_rightmost();

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
				/* A value that means that focus moved
				* to the left. */
				return -2;
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
		var i = idx ? idx : this.idx;
		this.items.eq(i).focus();
	}
};

var rcuNavigator = {
	items: [rcuMenuItems, rcuGameItems],
	in_charge_idx: -1,
	update: function() {
		this.in_charge_idx = -1;
		this.items.forEach(function(item) {
			item.update();
		});
	},
	first_move: function() {
		return (this.in_charge_idx == -1);
	},
	navigate: function(direction) {
		if (this.first_move()) {

			if (direction == "up") {
				/* Pressed Up for the first time. Focus first Menu
				* item. */
				this.in_charge_idx = 0;
			} else
				this.in_charge_idx = 1;
			/* Do not actually go any direction, focus first item. */
			direction = "none";
		}

		var item_in_charge = this.items[this.in_charge_idx];
		var dropped_out = item_in_charge.navigate(direction);

		if (dropped_out == -1)
			item_in_charge = this.items[++this.in_charge_idx];
		else if (dropped_out == -2)
			item_in_charge = this.items[--this.in_charge_idx];

		item_in_charge.focus();
	},
	unfocus: function() {
		if (this.in_charge_idx < 0)
			return;
		$(":focus").blur();
	}
}
