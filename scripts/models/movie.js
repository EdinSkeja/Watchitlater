define(['backbone', 
        'backbone-validation'
],  function(Backbone){
    
    var MovieModel = Backbone.Model.extend({
       
        defaults: {
            title: "",
            imdbRating: "",
            watched: false
        },
        validation: {
                title: [{
                    required: true,
                    pattern: 'url',
                    msg: "Please fill in a URL to a tilesheet"
                }],
        },       
        toggle: function () {
            this.save({
                    watched: !this.get('watched')
            });
        }
    });
    return MovieModel;
});