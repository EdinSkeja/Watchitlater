define(["backbone", "backbone-validation"], function(Backbone){

    var TodoModel = Backbone.Model.extend({
       
        defaults: {
            title: "",
            poster: "",
            imdbVotes: "",
            completed: false
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
                    completed: !this.get('completed')
            });
        }
    });
    return TodoModel;
});