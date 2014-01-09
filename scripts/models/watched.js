define(["backbone"
],  function(Backbone){
    
    var WatchedModel = Backbone.Model.extend({
       
        defaults: {
            title: "",
            date: ""
        }
        
    });
    return WatchedModel;
});