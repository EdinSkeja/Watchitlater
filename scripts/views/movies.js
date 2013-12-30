define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/movies.html',
	'common'
], function ($, _, Backbone, mlistTemplate, Common) {

	var MovieView = Backbone.View.extend({

		tagName:  'li',

		template: _.template(mlistTemplate),

		events: {
			'click .css-checkbox':	'toggleWatched',
			'click #destroy':       'clear',
            'keypress .edit':       'updateOnEnter'
		},

		initialize: function () {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(this.model, 'visible', this.toggleVisible);
		},

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.toggleClass('watched', this.model.get('watched'));
			this.toggleVisible();
			return this;
		},

		toggleVisible: function () {
			this.$el.toggleClass('hidden',  this.isHidden());
		},

		isHidden: function () {
			var isWatched = this.model.get('watched');
			return (
				(!isWatched && Common.MFilter === 'watched') ||
				(isWatched && Common.MFilter === 'active')
			);
		},

		toggleWatched: function () {
			this.model.toggle();
		},

		clear: function () {
			this.model.destroy();
		}
	});

	return MovieView;
});
