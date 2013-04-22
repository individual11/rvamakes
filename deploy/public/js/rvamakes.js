var Creative = Backbone.Model.extend({
    defaults: {
        name: "person name",
        img: "",
        url: "",
        tags: []
    },
    validation: {
        name: {
            required: true
        },
        email:{
            required: true,
            pattern: 'email'
        }
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
        var ubound = this.models.length;
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
        this.$el.find('.options').fadeToggle(150);
    },
    updateFilter: function (e) {
        var $target = $(e.target);
        this.$el.find(".options").fadeToggle(100);
        window.location.hash = "#/filter/" + $target.data("filter");
    },
    setSelected:function(filter){
        this.$el.find(".options .selected").removeClass("selected");
        var title = this.$el.find(".options [data-filter="+filter+"]").addClass("selected").html(),
        	titleID = title.substr(0, title.length - 1).toLowerCase(),
        	$current = this.$el.find(".current");
        	
        if($current.data('current-state')){
	        $current.removeClass($current.data('current-state'));
        }
        $current.addClass(titleID).data('current-state', titleID).html(title);
    },
    reset: function () {
    	window.location.replace("#/filter/")
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
        // test touch - modernizr returns false positive on chrome
        // add chrome test
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
    },
    filterByTag:function(tag){
        this.$el.attr('class','clearfix '+tag.toLowerCase());
    },
    clearFilter:function(){
        this.$el.attr('class','clearfix');
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
     Begin EntryView.js
********************************************** */

var EntryView = Backbone.View.extend({
    el: '#entry',
    template: Mustache.compile($('#tmplEntry').html()),
    events: {
        "submit form": "processEntry",
        "form:reset": "resetForm"
    },
    initialize: function () {
        this.render();
    },
    render: function () {
        this.$el.html(this.template());
        $('#upload').on('load', this.parseResponse);
    },
    processEntry: function (e) {
        var data = this.$el.find('form').serializeObject();
        var errors = this.validateForm(data);
        if (errors.length > 0) {
            e.preventDefault();
            tracker.trackEvent("Entry Form","Submit","Error Count",errors.length );
            this.showErrors(errors);
        }
        else{
            tracker.trackEvent("Entry Form","Submit","Valid");
        }
    },
    validateForm: function (data) {
        // validators
        var validEmail = /[A-Z0-9._+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i,
            validUrl = /^(http[s]?:\/\/){1,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/,
            validExt = /png|jpg|jpeg/;

        // retrieve file upload info
        var fileName = $('#form_img').val(),
            fileExt = fileName.substring(fileName.lastIndexOf('.')+1);

        // error list
        var errors = [];

        if (data.name.length == 0) {
            errors.push({field: 'name', msg: 'Name is a required field'})
        }
        if (!validEmail.test(data.email)) {
            errors.push({field: 'email', msg: 'A valid email is a required'})
        }
        if (data.url.length > 0) {
            if (!validUrl.test(data.url)) {
                errors.push({field: 'url', msg: 'URL appears to be malformed, please review'})
            }
        }
        if (!data.tags || data.tags == "") {
            errors.push({field: 'tags', msg: 'Select 1 or more tags that describe you'})
        }
        if (data.tags instanceof Array) {
            if (data.tags.length > 3) {
                errors.push({field: 'tags', msg: 'The number of selected tags cannot exceed 3'})
            }
        }
        if (!validExt.test(fileExt)){
            errors.push({field: 'img', msg: 'Please choose an image <small>(format: png or jpg)</small>'});
        }

        return errors;
    },
    showErrors: function (errors) {
        var $form = this.$el.find('form');
        $form.find('.error').removeClass('error');
        $form.find('.errors').empty();
        var field, $field, $error;
        errors.forEach(function(error){
            field = '[name="'+error.field+'"]';
            if (error.field == 'tags'){
                field = 'fieldset';
                $field = $form.find(field);
                $error = $field.find('.errors');
            }
            else{
                field = '[name="'+error.field+'"]';
                $field = $form.find(field);
                $error = $field.siblings('.errors');
            }
            $field.addClass('error');
            $error.append("<p>"+error.msg+"</p>");
        });
    },
    parseResponse: function () {
        var res = $('#upload').contents().text();
        if (res) {
            try {
                res = JSON.parse(res);
            }
            catch (e) {
                // nom nom nom
            }

            // TODO: add error checking

            var creative = new Creative(res);

            tracker.trackEvent("Entry Form","Submit","Success");
            $(this).trigger("creative:created", creative);
            $(this).trigger('form:reset');
        }
    },
    resetForm: function () {
        this.$el.find('form')[0].reset();
    }
});

/* **********************************************
     Begin GoogleAnalyticsView.js
********************************************** */

var GoogleAnalyticsView = Backbone.View.extend({
    el:'#tracker',
    trackEvent:function(category, label, action, value){
        //_gaq.push(['_trackEvent', category, label, action, value];
    },
    trackView:function(){
       // _gaq.push(['_trackPageview', location.pathname + location.search + location.hash]);
    }
});

/* **********************************************
     Begin AppView.js
********************************************** */

var AppView = Backbone.View.extend({
    el: "body",
    initialize: function () {
        this.router = new AppRouter();
        this.collections.creatives = new Creatives();
        this.collections.creatives.fetch({
            success: function () {
                Backbone.history.start();
            }
        });
        this.views.header = new AppHeaderView({});
        this.views.footer = new AppFooterView({});
        this.views.list = new ListView({collection: this.collections.creatives});
        this.views.show = new ShowView({});
        this.views.about = new AboutView({});
        this.views.entry = new EntryView({});



    },
    render: function () {

    },
    events: {
        "creative:created": "creative:created",
        "creative:show": "creative:show",
        "creative:random": "creative:random",
        "filter:clear": "filter:clear",
        "filter:change": "filter:change"
    },
    collections: {},
    views: {},
    "creative:created": function (e, model) {
        if (model instanceof Creative) {
            this.collections.creatives.add(model);
            this.router.navigate("#/show/" + model.get("_id"), true);
        }
    },
    "creative:show": function (e, data) {
        if (data == "") {
            this.router.navigate("#/", {trigger:true, replace:true});
        }else{
       		var model = this.collections.creatives.findWhere({_id: data});
       		this.views.show.renderCreative(model.toJSON());
       	}
    },
    "creative:random": function () {
        this.router.navigate("#/show/" + this.collections.creatives.randomId(), {trigger:true, replace:false});
    },
    "filter:clear":function(){
        this.views.list.clearFilter();
    },
    "filter:change": function (e, data) {
        if (data == "") {
            this.router.navigate("#/", {trigger:true, replace:true});
            this.views.list.clearFilter();
            this.views.header.setSelected(data);
        } else {
            this.views.list.filterByTag(data);
            this.views.header.setSelected(data);
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
        "filter/(:tag)": "filter",
        '*path':  'defaultRoute'
    },

    hideSections: function () {
        $('section').hide();
        $('header .options').hide();
        window.scrollTo(0,1);
    },
    defaultRoute:function(){
        this.list();
    },

    list: function () {
        tracker.trackView();
        this.hideSections();
        $('body').trigger('filter:clear');
        $('#list').show();

    },
    about: function () {
        tracker.trackView();
        this.hideSections();
        $('#about').show();
    },
    entry: function () {
        tracker.trackView();
        this.hideSections();
        $('#entry').show();
    },
    show: function (data) {
        tracker.trackView();
        $('body').trigger('creative:show', data);
        this.hideSections();
        $('#show').show();
    },
    random: function () {
        tracker.trackView();
        $('body').trigger('creative:random');
    },
    filter:function (tag){
        tracker.trackView();
        if(!tag) tag = "";
        this.hideSections();
        $('body').trigger('filter:change',tag);
        $('#list').show();
    }
});

/* **********************************************
     Begin app.js
********************************************** */

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-40190168-1']);
// TODO: change to rvamakes.com
_gaq.push(['_setDomainName', 'rvamakes.nodejitsu.com']);
var tracker = new GoogleAnalyticsView();
var app = new AppView();


