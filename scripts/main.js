console.log('Conifguring Require..');
require.config({
    //enforceDefine: true,
	baseUrl: "scripts/",
	paths: {
			'jquery': 'vendor/jquery',
			'underscore': 'vendor/underscore',
			'backbone': 'vendor/backbone',
			'backbone.localStorage': 'vendor/backbone.localStorage',
			'bootstrap': 'vendor/bootstrap',
			'router': 'vendor/router',
			'text': 'vendor/text',
			'backbone-rel': 'vendor/backbone-relational',
			'backbone-validation': 'vendor/backbone-validation-amd',
			'json': 'vendor/json'
	},
    shim: {
        backbone: {
            deps: ['underscore', 'jquery' ],
            exports: 'backbone'
        },
        underscore: {
            exports: "_"
        },
        relational: {
            deps: ['backbone']
        },
        localStorage: {
            deps: ['backbone'],
            exports: 'store'
        }
    }
});

require(['backbone','routers/router'], function(Backbone, Router) {
    new Router();
    Backbone.history.start();
	//new AppView();
});
