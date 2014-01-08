define(['backbone'
],  function(Backbone){
    
    var MovieModel = Backbone.Model.extend({
       
        defaults: {
            title: "",
            imdbRating: "",
            watched: false
        },      
        toggle: function () {
            this.save({
                    watched: !this.get('watched')
            });
        }
    });
    return MovieModel;
});