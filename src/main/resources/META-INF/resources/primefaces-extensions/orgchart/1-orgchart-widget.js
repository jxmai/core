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

		// Hardcode data for now
		var datascource = {
			'name' : 'Lao Lao',
			'title' : 'general manager',
			'children' : [ {
				'name' : 'Bo Miao',
				'title' : 'department manager'
			}, {
				'name' : 'Su Miao',
				'title' : 'department manager',
				'children' : [ {
					'name' : 'Tie Hua',
					'title' : 'senior engineer'
				}, {
					'name' : 'Hei Hei',
					'title' : 'senior engineer',
					'children' : [ {
						'name' : 'Pang Pang',
						'title' : 'engineer'
					}, {
						'name' : 'Xiang Xiang',
						'title' : 'UE engineer'
					} ]
				} ]
			}, {
				'name' : 'Yu Jie',
				'title' : 'department manager'
			}, {
				'name' : 'Yu Li',
				'title' : 'department manager'
			}, {
				'name' : 'Hong Miao',
				'title' : 'department manager'
			}, {
				'name' : 'Yu Wei',
				'title' : 'department manager'
			}, {
				'name' : 'Chun Miao',
				'title' : 'department manager'
			}, {
				'name' : 'Yu Tie',
				'title' : 'department manager'
			} ]
		};
		
		// hardcode data for now
		opts['data'] = datascource;

		this.jq.orgchart(opts);
	}
});
