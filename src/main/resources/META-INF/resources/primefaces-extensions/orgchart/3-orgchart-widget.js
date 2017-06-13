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
	}
});
