/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/todos.html',
	'common'
], function ($, _, Backbone, todosTemplate, Common) {
	'use strict';

	var TodoView = Backbone.View.extend({

		tagName:  'li',

		template: _.template(todosTemplate),

		events: {
			'click .toggle':	'toggleCompleted',
			'dblclick label':	'edit',
			'click .destroy':	'clear',
			'keypress .edit':	'updateOnEnter',
			'blur .edit':		'close'
		},

		initialize: function () {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(this.model, 'visible', this.toggleVisible);
		},

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.toggleClass('completed', this.model.get('completed'));

			this.toggleVisible();
			return this;
		},

		toggleVisible: function () {
			this.$el.toggleClass('hidden',  this.isHidden());
		},

		isHidden: function () {
			var isCompleted = this.model.get('completed');
			return (// hidden cases only
				(!isCompleted && Common.TodoFilter === 'completed') ||
				(isCompleted && Common.TodoFilter === 'active')
			);
		},

		toggleCompleted: function () {
			this.model.toggle();
		},

		clear: function () {
			this.model.destroy();
		}
	});

	return TodoView;
});
