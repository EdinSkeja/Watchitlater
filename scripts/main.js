require.config({
	baseUrl: "scripts/",
	paths: {
			'jquery': 'vendor/jquery',
			'underscore': 'vendor/underscore',
			'backbone': 'vendor/backbone',
			'backbone.localStorage': 'vendor/backbone.localStorage',
			'bootstrap': 'vendor/bootstrap',
			'router': 'vendor/router'
	},
    shim: {
        backbone: {
            deps: ['underscore', 'jquery' ],
            exports: 'backbone'
        },
        relational: {
            deps: ['backbone']
        },
        localStorage: {
            deps: ['backbone']
        }
    }
});

require(['views/app'], function(AppView) {
	new AppView;
});
