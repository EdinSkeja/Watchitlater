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
                    msg: "Please fill in a title"
                }]
        },       
        toggle: function () {
            this.save({
                    watched: !this.get('watched')
            });
        }
    });
    return MovieModel;
});