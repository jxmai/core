
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
        	
        	for(let i = 0; i < data.length; i++) {
        		
        		if(data[i]['enableRefresh']) {
        			data[i]['refreshCallBack'] = this.cfg.refreshCallBack;
        		}
        	}
        }
        
        if(this.cfg.addCallBack) {
        	for(let i = 0; i < data.length; i++) {
        		// TODO: to add a conditional statement to toggle addCallBack
        		data[i]['addCallBack'] = this.cfg.addCallBack;
        	}
        }
        
        this.jq.sDashboard({dashboardData : data});
        
        // bind "refresh" event
        
        this._bindEvents();
        
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
    },
    _bindEvents : function() {
    	var $this = this;
    	
    	this.jq.on("sdashboardrefresh", function() {
    		var behavior = $this.cfg.behaviors ? $this.cfg.behaviors['refresh'] : null;
    		if (behavior) {
                var options = {};
                behavior.call($this, options);
            }
    	});
    	
    
    	// TODO: to be removed
//    	this.jq.on("sdashboardClose", function() {
//    		var behavior = $this.cfg.behaviors ? $this.cfg.behaviors['close'] : null;
//    		if (behavior) {
//                var options = {};
//                behavior.call($this, options);
//            }
//    	});
    	
    	
    	this.jq.on("sdashboardRemove", function(e,widgetId) {
    		var behavior = $this.cfg.behaviors ? $this.cfg.behaviors['delete'] : null;
    		if (behavior) {
                var options = {
                		params : [ {
                            name : $this.id + '_widgetId',
                            value : widgetId
                        }]
                };
                behavior.call($this, options);
            }
    	});
    	
    	this.jq.on("sdashboardexpand", function(e,widgetDefinition) {
    		var behavior = $this.cfg.behaviors ? $this.cfg.behaviors['expand'] : null;
    		if (behavior) {
    			var options = {
    					 params : [ {
                             name : $this.id + '_widgetDefinitions',
                             value : JSON.stringify(widgetDefinition)
                         }]
    			};
    			behavior.call($this, options);
    		}
    	});
    	
    	this.jq.bind("sdashboardorderchanged", function(e, data) {
    		if (console) {
                console.log("Sorted Array");
                console.log("+++++++++++++++++++++++++");
                console.log(data.sortedDefinitions);
                console.log("+++++++++++++++++++++++++");
            }
    		
    		var behavior = $this.cfg.behaviors ? $this.cfg.behaviors['reorder'] : null;
    		if(behavior) {
    			var options = {
                        params : [ {
                            name : $this.id + '_sortedDefinitions',
                            value : JSON.stringify(data)
                        }]
                    };
    			behavior.call($this, options);
    		}
    		
    	});
    		
    	
    }
});