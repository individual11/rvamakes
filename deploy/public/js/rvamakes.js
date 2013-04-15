var Creative = Backbone.Model.extend({
    defaults:{
        name: "person name",
        img: "",
        url: "",
        tags:[]
    }
});

/* **********************************************
     Begin Creatives.js
********************************************** */

var Creatives = Backbone.Collection.extend({
    model: Creative,
    url: 'api/creatives'
});

/* **********************************************
     Begin AppHeaderView.js
********************************************** */

var AppHeaderView = Backbone.View.extend({
    el: "header",
    events: {
        "click .fob": "togglePanel",
        "click .options > div": "updateFilter",
        "click .prefix": "reset"
    },
    initialize: function () {

    },
    render: function () {

    },
    togglePanel: function () {
        this.$el.find('.options').toggle();
    },
    updateFilter: function (e) {
        var $target = $(e.target);
        this.$el.find(".options .selected").removeClass("selected");
        $target.addClass("selected");
        this.$el.find(".current").html($target.html());
        this.$el.find(".options").toggle();
        this.$el.trigger("filter:change", $target.data("filter"));
    },
    reset: function () {
        console.log('home');
        window.location.hash = "";
    }
});

/* **********************************************
     Begin AppFooterView.js
********************************************** */

var AppFooterView = Backbone.View.extend({
    el: "footer",
    initialize:function(){

    },
    render:function(){

    }
});

/* **********************************************
     Begin ListView.js
********************************************** */

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

/* **********************************************
     Begin ListItemView.js
********************************************** */

var ListItemView = Backbone.View.extend({
    tagName: "div",
    template: Mustache.compile($("#tmplListItem").html()),
    events:{
        "click": "click",
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
        console.log("click", e);
        //this.$el.trigger('creative:show',)
    },
    mouseOver:function(){
        console.log("mouseOver");
    },
    mouseOut:function(){
        console.log("mouseOut");
    }
});

/* **********************************************
     Begin ShowView.js
********************************************** */

var ShowView = Backbone.View.extend({
    el: "#show",
    initialize:function(){

    },
    render:function(){

    }
});

/* **********************************************
     Begin AppView.js
********************************************** */

var AppView = Backbone.View.extend({
    el: "body",
    initialize: function () {
        this.collections.creatives = new Creatives();
        this.collections.creatives.fetch();

        this.views.header = new AppHeaderView({});
        this.views.footer = new AppFooterView({});
        this.views.list = new ListView({collection: this.collections.creatives});
        this.views.show = new ShowView({});
        this.views.about = new AboutView({});
        this.views.entry = new EntryView({});


        this.router = new AppRouter();
        Backbone.history.start();
    },
    render: function () {

    },
    events: {
        "creative:create": "creative:create",
        "creative:show": "creative:show",
        "filter:change": "filter:change",
        "route:about": "route:about",
        "route:list": "route:list",
        "route:entry": "route:entry",
        "route:show": "route:show",
        "route:random": "route:random"
    },
    collections: {},
    views: {},
    "creative:create": function (e, data) {

    },
    "creative:show": function (e, data) {

    },
    "filter:change": function (e, data) {
        console.log(data);
    }
});

/* **********************************************
     Begin app.js
********************************************** */

var app = new AppView();


