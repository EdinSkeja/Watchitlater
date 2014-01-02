define(['backbone',
        'backbone.localStorage',
        'models/watched'
], function (Backbone, Store, Watched) {

	var WatchedCollection = Backbone.Collection.extend({
		model: Watched,

		localStorage: new Store('watchedlist')

	});

	return new WatchedCollection();
});
