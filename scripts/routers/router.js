//Main application..
console.log('Loading Router..');
define(['backbone', 
        'underscore', 
        'jquery',
        'views/app'
        
], function(Backbone, _, $, AppView) {
    
    var router = Backbone.Router.extend({
 
        routes: {
            "": "home"
        },
        
        home: function() {
            new AppView();
        }
	});
	return router;
});