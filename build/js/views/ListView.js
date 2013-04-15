var ListView = Backbone.View.extend({
    el: "#list",
    template: Mustache.compile($("#tmplListItem").html()),
    initialize:function(){

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