var ListItemView = Backbone.View.extend({
    tagName: "div",
    template: Mustache.compile($("#tmplListItem").html()),
    events:{
        "click": "click",
        "tap": "click"
    },
    initialize:function(){
        this.render();
    },
    render:function(){
        var klasses = "item " + this.model.get("tags").join(" ");
        this.$el.addClass(klasses).html(this.template(this.model.toJSON()));
    },
    click:function(e){
        var path = this.$el.find('a').attr('href');
        window.location.hash = path;
    }
});