
PrimeFaces.widget.ExtSDashboard = PrimeFaces.widget.BaseWidget.extend({
	/**
     * Initializes the widget.
     * 
     * @param {object}
     *        cfg The widget configuration.
     */
    init : function(cfg) {
        this._super(cfg);
        this.id = cfg.id;
        var opts = $.extend(true, {}, cfg);
        
        

        // create the Sdashboard
//        this.jq.sDashboard({dashboardData : JSON.parse(opts.dashboardData)});
        var data = JSON.parse(opts.dashboardData);
        
        //callbacks
        if(this.cfg.refreshCallBack){
        	data[0]['refreshCallBack'] = this.cfg.refreshCallBack;
        }
        
        this.jq.sDashboard({dashboardData : data});
        
//        var randomString = "Lorem ipsum dolor sit amet,consectetur adipiscing elit. Aenean lacinia mollis condimentum. Proin vitae ligula quis ipsum elementum tristique. Vestibulum ut sem erat.";
//        
//        var dashboardJSON = [ {
//            widgetTitle : "Text Widget",
//            widgetId : "id2",
//            enableRefresh : true,
//            refreshCallBack : function(widgetId){
//                return randomString + new Date();
//            },
//            widgetContent : randomString
//        }]
//
//        this.jq.sDashboard({
//        	dashboardData : dashboardJSON
//        })
    }
});