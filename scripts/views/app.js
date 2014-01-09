define(['jquery',
        'underscore',
        'backbone',
        'collections/movies',
        'collections/watched',
        'views/movies',
        'views/watched',
        'text!templates/count.html',
        'common'
], function ($, _, Backbone, Movies, Watched, MovieView, WatchedView, countTemplate, Common) {

	var AppView = Backbone.View.extend({
        
        searchs: 0,
        
		template: _.template(countTemplate),

		events: {
            'click #search-btn':        'makeSearch',
			'keypress #new-search':		'searchOnEnter',
			'click #clear-completed':	'clearWatched',
			'click #toggle-all':		'toggleAllWatched',
			'click #new-movie':         'createNew',
			'click #choose-movie':      'showMovie',
			'click .showwatched':       'showMovie',
            'click .linktomovie':       'showMovie'
		},

		initialize: function () {
			this.allCheckbox = this.$('#toggle-all')[0];
			this.$input = this.$('#new-search');
			this.$footer = this.$('#left-to-watch');
			this.$main = this.$('#main');
			this.$main1 = this.$('#main1');
			this.$rating = this.$('#imdbRating');
			this.$title = this.$('#Title');
			this.$searhlist = this.$('#searchdiv');

			this.listenTo(Movies, 'add', this.addOne);
			this.listenTo(Movies, 'reset', this.addAll);
			this.listenTo(Movies, 'all', this.render);
			this.listenTo(Watched, 'add', this.addOneWatched);
			this.listenTo(Watched, 'reset', this.addAllWatched);
			this.listenTo(Watched, 'all', this.render);

			Movies.fetch();
			Watched.fetch();
		},

		render: function () {
		    $('#about').removeClass('active')
            $('#home').addClass('active');
			var watched = Movies.watched().length;
			var remaining = Movies.remaining().length;
			if (Movies.length) {
				this.$main.show();
				this.$footer.show();

				this.$footer.html(this.template({
					watched: watched,
					remaining: remaining
				}));

			} else {
				this.$main.hide();
				this.$footer.hide();
			}

			if (Watched.length) {
			    this.$main1.show();
			} else {
			    this.$main1.hide();
			}

			this.allCheckbox.checked = !remaining;
		},

		addOne: function (movie) {
			var view = new MovieView({ model: movie });
			$('.list-group').append(view.render().el);
		},

		addOneWatched: function (watched) {
			var view = new WatchedView({ model: watched });
			$('.wlist-group').append(view.render().el);
		},

		addAll: function () {
			this.$('.list-group').html('');
			Movies.each(this.addOne, this);
		},

		addAllWatched: function () {
			this.$('.wlist-group').html('');
			Watched.each(this.addOneWatched, this);
		},
	
		newAttributes: function (title1, rating) {

			return {
				title: title1,
				order: Movies.nextOrder(),
				watched: false,
				imdbRating: rating
			};
		},
		
		newAttributesWatched: function (title1, date1) {

		    return {
				title: title1,
				date: date1
			};
		},
        
        //Skapa ny till watch list
		createNew: function (e) {
            var title1 = $(e.srcElement || e.target).attr('select-movie');
            var rating = $('#imdbRating').text();
            var watched = false;
            //Kollar så att filmen inte finns i nån lista..
            Movies.each(function(model) {
                if(title1 === model.get('title')) {
                    watched = true;
                    console.log('Alrdy in list!');
                }
            });

            if(watched === false) {
                Movies.create(this.newAttributes(title1, rating));
                $('#new-movie').attr("disabled", true);
            }
		},
        
        //Göra en sökning när man trycker enter
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
		
        //Göra en sökning
		makeSearch: function (e) {
		    //Visa search list om man gör en sökning
		    if(this.searchs === 0) {
		        $('#searchdiv').attr('class', 'show');
		        this.searchs++;
		    }
		    
            $(".search-list").remove();
            $("#single-movie").empty();
            this.searchMovies();
            this.$input.val('');
		},
        
        //Hämta vald film med json
        chooseMovie: function(cMovie)  {
            var disable = '';
            //Kollar om filmen finns i watch list
            Movies.each(function(model) {
                if(cMovie === model.get('title')) {
                    disable = 'disabled';
                }
            });
            //Kollar om filmen finns i watched list
            Watched.each(function(model) {
                if (disable === 'disabled') {
                    
                } else {
                    if(cMovie === model.get('title')) {
                        disable = 'disabled';
                    }
                }
            });

            var m = cMovie;
            var url = "http://www.omdbapi.com/";
            $.ajax({
                type: 'GET',
                url: url,
                data: {t: m},
                dataType: 'json',
                success: function(data) {
                    if(data) {
                    var items = [];
                    $.each( data, function( key, val ) {
                        if (key == 'Title') {

                            items.push('<button id="new-movie" class="btn btn-success" type="button" select-movie="'+val+'" style="float:right;" '+ disable +'>+</button>');
                            items.push( "<h3 id='" + key + "'>" + val + "</h3>" );
                        }
                        else if (key == 'Year') {
                            items.push( "<p id='" + key + "'>Year: " + val + "</p>" );
                        }
                        else if (key == 'Genre') {
                            items.push( "<p id='" + key + "'>Genre: " + val + "</p>" );
                        }
                        else if (key == 'Actors') {
                            items.push( "<p id='" + key + "'>Stars: " + val + "</p>" );
                        }
                        else if (key == 'Plot') {
                            items.push( "<p id='" + key + "'>Plot: " + val + "</p>" );
                        }
                        else if (key == 'Poster') {
                            if(val.length > 4) {
                                items.push( "<img id='" + key + "' src='http://eddmedia.se/getimg.php?url="+ val +"'/>" );
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
                                items.push( "<p id='" + key + "'>Rating: -</p>" );
                            }
                        }
                        else if (key == 'Type') {
                            items.push("<p id='"+ key +"'>Type: "+ val +"</p>");
                        }

                        else if (key == 'Error') {
                            items.push("<h2 id='"+ key +"'>"+ val +"</h2>");
                        }

                    });
                    if(disable === 'disabled') {
                        items.push("<b>Movie already watched or is in watch list!</b>");
                    } else {
                        items.push("");
                    }
                    for (var i = 0; i < items.length; i++) {
                        if(!items[i]) {
                            items[i] = "";
                        }
                    }
                    $( "<div/>", {
                        "class": "well",
                        html: items[0] + items[6] + items[1] + items[8] + items[7] + items[2] + items[3] + items[4] + items[5] + items[9]
                    }).appendTo( "#single-movie" );
                    $('#Type').css('textTransform', 'capitalize');
                }
                },
                error: function() {
                    alert("Error: Something went wrong");
                }
            });


        },
        
        //Hämtar 3 filmer och presenterar i search list
        searchMovies: function () {
            //Using xml to get search list..
            var name = this.$input.val();
            var url = "http://www.omdbapi.com/?r=xml";
            $.ajax({
                type: "GET",
                url: url,
                data: {s: name},
                dataType: "xml",
                success: function(xml) {
                    var items = [];
                    $(xml).find('Movie').each(function(index){

                        if(index < 3) {
                            var title = $(this).attr('Title');
                            var year = $(this).attr('Year');
                            items.push('<li class="well"><button id="choose-movie" type="button" class="btn btn-primary" data-movie="'+ title+'">&#187;</button><label style=" margin: 10px;">'+title+' ('+year+')</label></li>');
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
                error: function(){
                    alert("Error: Something went wrong");
                }

            });




        },

        //Visa vald film
        showMovie: function (e) {
            $("#single-movie").empty();
            this.chooseMovie($(e.srcElement || e.target).attr('data-movie'));
        },

        //Tar bort filmer från watch list och lägger dom i watched list!
		clearWatched: function () {
	        var d = new Date();

            var month = d.getMonth()+1;
            var day = d.getDate();
            
            var output = d.getFullYear() + '/' +
                ((''+month).length<2 ? '0' : '') + month + '/' +
                ((''+day).length<2 ? '0' : '') + day;
            
            var that = this;            
            Movies.each(function (movie) {
				Watched.create(that.newAttributesWatched(movie.get('title'), output));
			});
			_.invoke(Movies.watched(), 'destroy');
			
			
			return false;
		},
        
        // alla filmer i watch list blir markerade som watched
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