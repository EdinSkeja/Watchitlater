define(['jquery',
        'underscore',
        'backbone',
        'text!templates/watched.html',
        'common'
], function ($, _, Backbone, wlistTemplate, Common) {

	var MovieView = Backbone.View.extend({

		tagName:  'li',

		template: _.template(wlistTemplate),

		events: {
			'click #destroy':       'clear'
		},

		initialize: function () {
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		
		clear: function () {
			this.model.destroy();
		}
	});

	return MovieView;
});
