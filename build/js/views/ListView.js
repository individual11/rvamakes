var ListView = Backbone.View.extend({
    el: "#list",
    template: Mustache.compile($("#tmplListItem").html()),
    initialize:function(){
        var touch = Modernizr.touch,
            agent = navigator.userAgent || navigator.vendor || window.opera,
            test = /chrome/i.test(agent.toLowerCase());
        if (touch && test) touch = false;
        if (touch) this.$el.addClass('touch');
        this.listenTo(this.collection, "add update remove refresh reset", this.render);
    },
    render:function(){
        var self = this;
        self.$el.empty();
        var item = null;
        this.collection.models.forEach(function(model){
            item = new ListItemView({model:model});
            self.$el.append(item.el);
        });
    } 
});