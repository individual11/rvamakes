var AboutView = Backbone.View.extend({
    el: '#about',
    template: Mustache.compile($('#tmplAbout').html()),
    initialize: function(){
        this.render();
    },
    render:function(){
        this.$el.html(this.template());
    }
});