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
			'click #toggle-all':		'toggleAllWatched',
			'click .btn-default':       'createNew',
			'click .btn-btn-primary':        'choosingMovie'
		},

		initialize: function () {
			this.allCheckbox = this.$('#toggle-all')[0];
			this.$input = this.$('#new-search');
			this.$footer = this.$('#footer');
			this.$main = this.$('#main');
			this.$rating = this.$('#imdbRating');
			this.$title = this.$('#Title');

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
		    console.log(this.$title.text());
			return {
				title: this.$title.text(),
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
			$(".search-list").remove();
			$(".the-movie").remove();
            this.searchMovies();
			this.$input.val('');
		},
		
		searchOnClick: function () {
            $(".search-list").remove();
            $(".the-movie").remove();
            console.log(this.$input.val());
            
            this.searchMovies();
            
            this.$input.val('');
		},
       
        chooseMovie: function(cMovie)  {
            var m = cMovie;
            $.getJSON( "http://www.omdbapi.com/?t="+m+"&plot=full", function( data ) {
                if(data !== null) {
                    var items = [];
                    $.each( data, function( key, val ) {
                        if(key == 'Title') {
                            
                            items.push('</br><button id="'+val+'" class="btn-default" type="button">Add to list!</button>');
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
                        else if (key == 'Error') {
                            items.push("<h2 id='"+ key +"'>"+ val +"</h2>");
                        }
                        
                    });
                    
                    $( "<ul/>", {
                        "class": "the-movie",
                        html: items.join( "" )
                    }).appendTo( "#search" );
                }
                else
                    console.log("NULL")
            });	
            
        },
        
        searchMovies: function () {
            
            $.ajax({type: "GET",
                url: "http://www.omdbapi.com/?s="+this.$input.val()+"&r=xml",
                dataType: "xml",
                success: function(xml) {
                    var items = [];
                    $(xml).find('Movie').each(function(index){
                        if(index < 3) {
                            var title = $(this).attr('Title');
                            var year = $(this).attr('Year');
                            items.push('<li>'+title+' ('+year+') <button id="'+title+'" type="button" class="btn-btn-primary">GO</button></li> ');
                          //  $('#search').append('<li>'+title+'('+year+')</li>');
                        }
                    });
                    
                    $( "<ul/>", {
                        "class": "search-list",
                        html: items.join("")
                    }).appendTo("#search");
                    
                }
                
            });
            
        
            
            
        },
        
        choosingMovie: function () {
           // $(".search-list").remove();
           
            this.chooseMovie("Thor");
              
        },
        
		clearWatched: function () {
			_.invoke(Movies.watched(), 'destroy');
			return false;
		},

		toggleAllWatched: function () {
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
