define(['jquery',
        'underscore',
        'backbone',
        'collections/watched',
        'text!templates/movies.html',
        'common'
], function ($, _, Backbone, wList, mlistTemplate, Common) {

	var MovieView = Backbone.View.extend({

		tagName:  'li',

		template: _.template(mlistTemplate),

		events: {
			'click .css-checkbox':	'toggleWatched',
			'click #destroy':       'clear'
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
		
		newAttributes: function (title1, date1) {
			return {
				title: title1,
				date: date1
			};
		},

		clear: function () {
            var d = new Date();

            var month = d.getMonth()+1;
            var day = d.getDate();
            
            var output = d.getFullYear() + '/' +
                ((''+month).length<2 ? '0' : '') + month + '/' +
                ((''+day).length<2 ? '0' : '') + day;
            
                        
			this.model.destroy();
			wList.create(this.newAttributes(this.model.get('title'), output));
		}
	});

	return MovieView;
});
