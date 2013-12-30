define(['backbone', 
        'underscore', 
        'jquery',
        'views/app',
        'views/about'
        
], function(Backbone, _, $, AppView, AboutView) {
    
    var router = Backbone.Router.extend({
 
        routes: {
            "": "index",
            "about": "about"
        },
        index: function() {
            new AppView();
        },
        about: function() {
            new AboutView();
        }
        
        
	});
	return router;
});