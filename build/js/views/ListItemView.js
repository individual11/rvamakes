var ListItemView = Backbone.View.extend({
    tagName: "div",
    template: Mustache.compile($("#tmplListItem").html()),
    events:{
        "click": "click",
        "tap": "click",
        "mouseOver": "mouseOver",
        "mouseOut": "mouseOut"
    },
    initialize:function(){
        this.render();
    },
    render:function(){
        //console.log("list item render", this.model.toJSON());
        var klasses = "item " + this.model.get("tags").join(" ");
        this.$el.addClass(klasses).html(this.template(this.model.toJSON()));
    },
    click:function(e){
        var path = this.$el.find('a').attr('href');
        window.location.hash = path;
    },
    mouseOver:function(){
        console.log("mouseOver");
    },
    mouseOut:function(){
        console.log("mouseOut");
    }
});