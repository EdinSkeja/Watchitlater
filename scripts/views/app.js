/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'collections/todos',
	'views/todos',
	'text!templates/stats.html',
	'common'
], function ($, _, Backbone, Todos, TodoView, statsTemplate, Common) {
	'use strict';

	var AppView = Backbone.View.extend({

		el: '#todoapp',

		template: _.template(statsTemplate),

		events: {
            'click #search-btn':        'searchOnClick',
			'keypress #new-todo':		'createOnEnter',
			'click #clear-completed':	'clearCompleted',
			'click #toggle-all':		'toggleAllComplete'
		},

		initialize: function () {
			this.allCheckbox = this.$('#toggle-all')[0];
			this.$input = this.$('#new-todo');
			this.$footer = this.$('#footer');
			this.$main = this.$('#main');

			this.listenTo(Todos, 'add', this.addOne);
			this.listenTo(Todos, 'reset', this.addAll);
			this.listenTo(Todos, 'change:completed', this.filterOne);
			this.listenTo(Todos, 'filter', this.filterAll);
			this.listenTo(Todos, 'all', this.render);

			Todos.fetch();
		},

		render: function () {
			var completed = Todos.completed().length;
			var remaining = Todos.remaining().length;
            
			if (Todos.length) {
				this.$main.show();
				this.$footer.show();

				this.$footer.html(this.template({
					completed: completed,
					remaining: remaining
				}));
				
				this.$('#filters li a')
					.removeClass('selected')
					.filter('[href="#/' + (Common.TodoFilter || '') + '"]')
					.addClass('selected');
				
				
					
			} else {
				this.$main.hide();
				this.$footer.hide();
			}
		
			this.allCheckbox.checked = !remaining;
		},

		addOne: function (todo) {
			var view = new TodoView({ model: todo });
			$('#todo-list').append(view.render().el);
		},

		// Add all items in the **Todos** collection at once.
		addAll: function () {
			this.$('#todo-list').html('');
			Todos.each(this.addOne, this);
		},

		filterOne: function (todo) {
			todo.trigger('visible');
		},

		filterAll: function () {
			Todos.each(this.filterOne, this);
		},

		// Generate the attributes for a new Todo item.
		newAttributes: function () {
			return {
				title: this.$input.val().trim(),
				order: Todos.nextOrder(),
				completed: false,
				imdbRating: 7.0,
				poster: ''
			};
		},
		
		createOnEnter: function (e) {
			if (e.which !== Common.ENTER_KEY ) {
				return;
				
			}
			$(".my-new-list").remove();
            console.log(this.$input.val());
            this.searchMovies();
			//Todos.create(this.newAttributes());
			this.$input.val('');
		},
		
		searchOnClick: function () {
		    $(".my-new-list").remove();
		    console.log(this.$input.val());
		    
            this.searchMovies();
            
            this.$input.val('');
		},
        searchMovies: function () {
            $.getJSON( "http://www.omdbapi.com/?t="+this.$input.val()+"&plot=short", function( data ) {
            
                var items = [];
                var contentArr = new Array ('Title', 'Year', 'Genre', 'Actors', 'Plot', 'imdbRating', 'Poster', 'Type');
                $.each( data, function( key, val ) {
                    if(key == 'Title') {
                        items.push( "<h3 id='" + key + "'>" + val + "</h3>" );
                    }
                    else if (key == 'Year') {
                        items.push( "<label id='" + key + "'>" + val + "</label>" );
                    }
                    else if (key == 'Genre') {
                        items.push( "<p id='" + key + "'>" + val + "</p>" );
                    }
                    else if (key == 'Actors') {
                        items.push( "<p id='" + key + "'>" + val + "</p>" );
                    }
                    else if (key == 'Plot') {
                        items.push( "<p id='" + key + "'>" + val + "</p>" );
                    }
                    else if (key == 'imdbRating') {
                        if (!isNaN(val)) {
                            items.push( "<p id='" + key + "'>" + val + "</p>" );
                        }
                        else {
                            items.push( "<p id='" + key + "'>No Rating</p>" );
                        }
                    }
                    else if (key == 'Poster') {
                        items.push( "<img id='" + key + "' src='" + val + "' style='width:130px; height: 200px;'/>" );
                    }
                    
                });
            
                $( "<ul/>", {
                    "class": "my-new-list",
                    html: items.join( "" )
                }).appendTo( "#search" );
            });		
        },
		// Clear all completed todo items, destroying their models.
		clearCompleted: function () {
			_.invoke(Todos.completed(), 'destroy');
			return false;
		},

		toggleAllComplete: function () {
			var completed = this.allCheckbox.checked;

			Todos.each(function (todo) {
				todo.save({
					'completed': completed
				});
			});
		}
	});

	return AppView;
});
