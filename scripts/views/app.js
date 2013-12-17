/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'collections/movies',
	'views/movies',
	'text!templates/stats.html',
	'common'
], function ($, _, Backbone, Movies, MovieView, statsTemplate, Common) {
	'use strict';
    
	var AppView = Backbone.View.extend({
        rating: 2,
		el: '#movielistapp',

		template: _.template(statsTemplate),

		events: {
            'click #search-btn':        'searchOnClick',
			'keypress #new-search':		'createOnEnter',
			'click #clear-completed':	'clearWatched',
			'click #toggle-all':		'toggleAllComplete',
			'click #add-to-list':       'createNew'
		},

		initialize: function () {
			this.allCheckbox = this.$('#toggle-all')[0];
			this.$input = this.$('#new-search');
			this.$footer = this.$('#footer');
			this.$main = this.$('#main');
			this.$rating = this.$('#imdbRating');
			this.$poster = this.$('#Poster');

			this.listenTo(Movies, 'add', this.addOne);
			this.listenTo(Movies, 'reset', this.addAll);
			this.listenTo(Movies, 'change:watched', this.filterOne);
			this.listenTo(Movies, 'filter', this.filterAll);
			this.listenTo(Movies, 'all', this.render);

			Movies.fetch();
		},

		render: function () {
			var watched = Movies.watched().length;
			var remaining = Movies.remaining().length;
            
			if (Movies.length) {
				this.$main.show();
				this.$footer.show();

				this.$footer.html(this.template({
					watched: watched,
					remaining: remaining
				}));
				
				this.$('#filters li a')
					.removeClass('selected')
					.filter('[href="#/' + (Common.MFilter || '') + '"]')
					.addClass('selected');
				
				
					
			} else {
				this.$main.hide();
				this.$footer.hide();
			}
		
			this.allCheckbox.checked = !remaining;
		},

		addOne: function (movie) {
			var view = new MovieView({ model: movie });
			$('#movie-list').append(view.render().el);
		},

		addAll: function () {
			this.$('#todo-list').html('');
			Movies.each(this.addOne, this);
		},

		filterOne: function (movie) {
			movie.trigger('visible');
		},

		filterAll: function () {
			Movies.each(this.filterOne, this);
		},

		newAttributes: function () {
			return {
				title: this.$input.val().trim(),
				order: Movies.nextOrder(),
				watched: false,
				imdbRating: this.$rating.text(),
			};
		},
		
		createNew: function () {
		    Movies.create(this.newAttributes());
		},
		
		createOnEnter: function (e) {
			if (e.which !== Common.ENTER_KEY ) {
				return;
				
			}
			$(".my-new-list").remove();
            console.log(this.$input.val());
            this.searchMovies();
			this.$input.val('');
		},
		
		searchOnClick: function () {
            $(".my-new-list").remove();
            console.log(this.$input.val());
            
            this.searchMovies();
            
            this.$input.val('');
		},
       
        searchMovies: function () {
            $.getJSON( "http://www.omdbapi.com/?t="+this.$input.val()+"&plot=full", function( data ) {
                if(data != null) {
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
                            if(val.length > 4) {
                                items.push( "<img id='" + key + "' src='" + val + "' style='width:130px; height: 200px;'/>" );
                            }
                            else {
                                items.push( "<img id='" + key + "' src='styles/img/noImage.gif' style='width:130px; height: 200px;'/>" );
                            }
                        }
                        
                        
                    });
                
                    $( "<ul/>", {
                        "class": "my-new-list",
                        html: items.join( "" )
                    }).appendTo( "#search" );
                }
                else
                    console.log("NULL")
            });	
            
        },
	
		clearWatched: function () {
			_.invoke(Movies.watched(), 'destroy');
			return false;
		},

		toggleAllComplete: function () {
			var watched = this.allCheckbox.checked;

			Movies.each(function (movie) {
				movie.save({
					'watched': watched
				});
			});
		}
	});

	return AppView;
});
