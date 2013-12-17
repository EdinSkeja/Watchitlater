define(["backbone", 
        "backbone-validation"
],  function(Backbone){
    
    var MovieModel = Backbone.Model.extend({
       
        defaults: {
            title: "",
            imdbRating: "",
            watched: false
        },
        validation: {
            title: [
                    { required: true, msg: "Please enter the name of the movie"}
            ]
        }, 
        setTitle: function(newTitle) {
            this.set("title", newTitle);
        },
        toggle: function () {
            this.save({
                    watched: !this.get('watched')
            });
        }
    });
    return MovieModel;
});