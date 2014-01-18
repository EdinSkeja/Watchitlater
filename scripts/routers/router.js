define(['backbone',
        'underscore',
        'jquery',
        'views/app',
        'views/about'

], function(Backbone, _, $, AppView, AboutView) {

    var Router = Backbone.Router.extend({

        initialize: function(opt) {
            this.el = opt.el;
        },

        routes: {
            "": "index",
            "about": "about"
        },

        changeView: function(newView) {
            // Views might not have the dispose
            if(typeof this.view.dispose === "function") {
                this.view.dispose();
            }
            this.view = newView;
        },

        index: function() {
            // this.el.empty();
            this.changeView(new AppView({ el: this.el}));
        },

        about: function() {
            this.changeView(new AboutView({ el: this.el}));
        }


	});

	return Router;

});