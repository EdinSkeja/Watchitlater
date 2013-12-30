define([
	'jquery',
	'underscore',
	'backbone',
	'collections/movies',
	'views/movies',
	'text!templates/stats.html',
	'common'
], function ($, _, Backbone, Movies, MovieView, statsTemplate, Common) {
    
	var AppView = Backbone.View.extend({
        searchs: 0,
        
		el: '#movielistapp',

		template: _.template(statsTemplate),

		events: {
            'click #search-btn':        'makeSearch',
			'keypress #new-search':		'searchOnEnter',
			'click #clear-completed':	'clearWatched',
			'click #toggle-all':		'toggleAllWatched',
			'click #new-movie':         'createNew',
			'click #choose-movie':      'choosingMovie',
			'dblclick .css-label':      'showMovie'
		},

		initialize: function () {
			this.allCheckbox = this.$('#toggle-all')[0];
			this.$input = this.$('#new-search');
			this.$footer = this.$('#left-to-watch');
			this.$main = this.$('#main');
			this.$rating = this.$('#imdbRating');
			this.$title = this.$('#Title');
			this.$searhlist = this.$('#searchdiv');

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
			$('.list-group').append(view.render().el);
		},

		addAll: function () {
			this.$('.list-group').html('');
			Movies.each(this.addOne, this);
		},

		filterOne: function (movie) {
			movie.trigger('visible');
		},

		filterAll: function () {
			Movies.each(this.filterOne, this);
		},

		newAttributes: function (title1, rating) {
		    
			return {
				title: title1,
				order: Movies.nextOrder(),
				watched: false,
				imdbRating: rating
			};
		},
		
		createNew: function (e) {
            var title = $(e.srcElement || e.target).attr('select-movie');
            var rating = $('#imdbRating').text();
            Movies.create(this.newAttributes(title, rating));
            $('#new-movie').attr("disabled", true);
		},
		
		searchOnEnter: function (e) {
		    if (e.which !== Common.ENTER_KEY ) {
				return;
			}
			if(this.searchs === 0) {
		        $('#searchdiv').attr('class', 'show');
		        this.searchs++;
		    }
			$(".search-list").remove();
			$("#single-movie").empty();
            this.searchMovies();
			this.$input.val('');
		},
		
		makeSearch: function (e) {
		    if(this.searchs === 0) {
		        $('#searchdiv').attr('class', 'show');
		        this.searchs++;
		    }
            $(".search-list").remove();
            $("#single-movie").empty();
            
            
            this.searchMovies();
            this.$input.val('');
		},
       
        chooseMovie: function(cMovie)  {
            //get json objects 
            var m = cMovie;
            $.getJSON( "http://www.omdbapi.com/?t="+m+"&plot=short", function( data ) {
                if(data !== null) {
                    var items = [];
                    $.each( data, function( key, val ) {
                        if (key == 'Title') {
                            
                            items.push('<button id="new-movie" class="btn btn-success" type="button" select-movie="'+val+'" style="float:right;">+</button>');
                            items.push( "<h3 id='" + key + "'>" + val + "</h3>" );
                        }
                        else if (key == 'Year') {
                            items.push( "<b id='" + key + "'>" + val + "</b>" );
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
                        else if (key == 'Poster') {
                            if(val.length > 4) {
                                items.push( "<img id='" + key + "' src='" + val + "'/>" );
                            }
                            else {
                                items.push( "<img id='" + key + "' src='styles/img/noImage.gif'/>" );
                            }
                        }
                        else if (key == 'imdbRating') {
                            if (!isNaN(val)) {
                                items.push( "<p id='" + key + "'>Rating: " + val + "</p>" );
                            }
                            else {
                                items.push( "<p id='" + key + "'>No rating yet!</p>" );
                            }
                        }
                        
                        else if (key == 'Error') {
                            items.push("<h2 id='"+ key +"'>"+ val +"</h2>");
                        }
                        
                    });
                    
                    $( "<div/>", {
                        "class": "well",
                        html: items[0] + items[6] + items[1] + items[7] + items[2] + items[3] + items[4] + items[5]  
                    }).appendTo( "#single-movie" );
                }
                else
                    console.log("NULL")
            });	
            
        },
        
        searchMovies: function () {
            //Using xml to get search list..
            var name = this.$input.val();
            $.ajax({type: "GET",
                url: "http://www.omdbapi.com/?s="+name+"&r=xml",
                dataType: "xml",
                success: function(xml) {
                    var items = [];
                    $(xml).find('Movie').each(function(index){
            
                        if(index < 3) {
                            var title = $(this).attr('Title');
                            var year = $(this).attr('Year');
                            items.push('<li class="well"><button id="choose-movie" type="button" class="btn btn-primary" data-movie="'+ title+'">&#187;</button><label style=" margin: 10px;">'+title+' ('+year+')</label></li>');
                          //  $('#search').append('<li>'+title+'('+year+')</li>');
                        }
                    });
                    $(xml).find('error').each(function(index){
                        items.push('<li><p>No movies with title: ´'+name+'´</p></li> ');
                    });
                    $( "<ul/>", {
                        "class": "search-list",
                        html: items.join("")
                    }).appendTo("#search");
                    
                },
                error: function(){alert("Error: Something went wrong");}
                
            });
            
        
            
            
        },
        
        choosingMovie: function (e) {
            $("#single-movie").empty();
            this.chooseMovie($(e.srcElement || e.target).attr('data-movie'));
              
        },
        
        showMovie: function (e) {
            $("#single-movie").empty();
            this.chooseMovie($(e.srcElement || e.target).attr('data-movie'));
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
