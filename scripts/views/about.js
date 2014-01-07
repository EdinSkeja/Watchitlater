define(['jquery',
        'underscore',
        'backbone',
        'text!templates/about.html'
], function ($, _, Backbone, aboutTemplate) { 
    
    var AboutView = Backbone.View.extend({
        
        el: '#aboutcontent',
        
        template: _.template(aboutTemplate),

        initialize: function() {
            this.render();
        },

        render: function() {
           
            $('#home').removeClass('active')
            $('#about').addClass('active');
            this.$el.html(this.template(this));
            return this;
        }
            
    });
    return AboutView;
});