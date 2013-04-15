var EntryView = Backbone.View.extend({
    el: '#entry',
    template: Mustache.compile($('#tmplEntry').html()),
    events:{
        "click .addCreative":"processEntry"
    },
    initialize: function(){
        this.render();
    },
    render:function(){
        this.$el.html(this.template());
    },
    processEntry:function(e){
        e.preventDefault();
        var $form = this.$el.find('form');
        console.log($form.serializeArray());
    }
});