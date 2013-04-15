var EntryView = Backbone.View.extend({
    el: '#entry',
    template: Mustache.compile($('#tmplEntry').html()),
    initialize: function(){
        this.render();
    },
    render:function(){
        this.$el.html(this.template());
    }
});