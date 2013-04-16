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
    url: 'api/creatives',
    randomId: function(){
        // get ubound of array
        var ubound = this.models.length - 1;
        // get random index
        var randex = Math.floor(Math.random() * ubound);
        return this.models[randex].get("_id");
    }
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
     Begin EntryView.js
********************************************** */

var EntryView = Backbone.View.extend({
    el: '#entry',
    template: Mustache.compile($('#tmplEntry').html()),
    events:{
        //"click .addCreative":"processEntry",
        "load #upload":"parseResponse"
    },
    initialize: function(){
        this.render();
    },
    render:function(){
        this.$el.html(this.template());
        //this.$el.on('')
    },
    processEntry:function(e){
        e.preventDefault();
        var $form = this.$el.find('form');
        console.log($form.serializeArray());
    },
    parseResponse:function(e){
        var res = $('#upload').contents().text();
        if (res){
            res = parseJSON(res);
            this.$el.trigger("creative:created",res);
        }


    }
});

/* **********************************************
     Begin AppRouter.js
********************************************** */

var AppRouter = Backbone.Router.extend({
    routes:{
        "list":"list",
        "about": "about",
        "entry": "entry",
        "show/:id": "show",
        "random": "random",
        "filter/:tag": "filter",
        '*path':  'defaultRoute'
    },
    initialize: function(){

    },
    hideSections: function () {
        $('section').hide();
    },
    defaultRoute:function(){
        this.list();
    },

    list: function () {
        console.log('list');
        this.hideSections();
        $('#list').show();
    },
    about: function () {
        console.log('about');
        this.hideSections();
        $('#about').show();
    },
    entry: function () {
        console.log('entry');
        this.hideSections();
        $('#entry').show();
    },
    show: function (data) {
        $('body').trigger('creative:show', data);
        this.hideSections();
        $('#show').show();
    },
    random: function () {
        $('body').trigger('creative:random');
    },
    filter:function (tag){
        console.log('filter', tag);
        $("list");
    }
});

/* **********************************************
     Begin AboutView.js
********************************************** */

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

/* **********************************************
     Begin ShowView.js
********************************************** */

var ShowView = Backbone.View.extend({
    el: "#show",
    template: Mustache.compile($("#tmplShowItem").html()),
    renderCreative:function(json){
        this.$el.html(this.template(json));
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
        "creative:random": "creative:random",
        "filter:change": "filter:change"
    },
    collections: {},
    views: {},
    "creative:create": function (e, model) {
        console.log('creative:create',model instanceof Creative,model);
        if(model instanceof Creative){
            this.collections.add(model);
        }
    },
    "creative:show": function (e, data) {
        var model = this.collections.creatives.findWhere({_id:data});
        this.views.show.renderCreative(model.toJSON());
    },
    "creative:random": function () {
        this.router.navigate("#/show/"+this.collections.creatives.randomId(),true);
    },
    "filter:change": function (e, data) {
        console.log(data);

    }
});

/* **********************************************
     Begin app.js
********************************************** */

var app = new AppView();


