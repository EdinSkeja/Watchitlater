require.config({
    //enforceDefine: true,
	baseUrl: "scripts/",
	paths: {
			'jquery':                'vendor/jquery',
			'underscore':            'vendor/underscore',
		    'backbone':              'vendor/backbone',
			'backbone.localStorage': 'vendor/backbone.localStorage',
			'router':                'vendor/router',
	        'text':                  'vendor/text',
		    'bootstrap':             'vendor/bootstrap',
            'router':                'routers/router'
	},

    shim: {
        'backbone': {
            deps: ['underscore', 'jquery' ],
            exports: 'backbone'
        },
        'underscore': {
            exports: "_"
        },
        'localStorage': {
            deps: ['backbone'],
            exports: 'store'
        },
        'bootstrap': {
            deps: ['jquery']
        }
    }
});

require(['backbone', 'router'], function(Backbone, Router) {
    var container = $('#movielistapp');
    var router = new Router({el: container});
    Backbone.history.start();
});
