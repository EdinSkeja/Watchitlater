define(["backbone", 
        "backbone-validation"
],  function(Backbone){
    
    var WatchedModel = Backbone.Model.extend({
       
        defaults: {
            title: "",
            date: ""
        }
        
    });
    return WatchedModel;
});