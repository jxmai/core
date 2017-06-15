PrimeFaces.widget.ExtOrgChart = PrimeFaces.widget.BaseWidget.extend({

	/**
	 * Initializes the widget.
	 * 
	 * @param {object}
	 *            cfg The widget configuration.
	 */
	init : function(cfg) {
		this._super(cfg);
		this.id = cfg.id;
		var opts = $.extend(true, {}, cfg);

		opts['data'] = JSON.parse(opts['data']);

		this.jq.orgchart(opts);

		this._bindEvents();

	},
	_bindEvents : function() {
		var $this = this;

		this.jq.on('click', '.node', function() {
			var $thisNode = $(this);

			var behavior = $this.cfg.behaviors ? $this.cfg.behaviors['click']
					: null;

			if (behavior) {
				var options = {
					params : [ {
						name : $this.id + '_nodeId',
						value : $thisNode[0].id
					} ]

				};
				behavior.call($this, options);
			}
		});
	}
});
