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