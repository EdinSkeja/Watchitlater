define(['underscore',
	    'backbone',
	    'backbone.localStorage',
	    'models/movie'
], function (_, Backbone, Store, Movie) {

	var MoviesCollection = Backbone.Collection.extend({
		model: Movie,

		localStorage: new Store('movielist'),

		watched: function () {
			return this.filter(function (movie) {
				return movie.get('watched');
			});
		},

		remaining: function () {
			return this.without.apply(this, this.watched());
		},

		nextOrder: function () {
			if (!this.length) {
				return 1;
			}
			return this.last().get('order') + 1;
		},

		comparator: function (movie) {
			return movie.get('order');
		}
	});

	return new MoviesCollection();
});
