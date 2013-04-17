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
    hideSections: function () {
        $('section').hide();
        window.scrollTo(0,1);
    },
    defaultRoute:function(){
        this.list();
    },

    list: function () {
        this.hideSections();
        $('#list').show();

    },
    about: function () {
        this.hideSections();
        $('#about').show();
    },
    entry: function () {
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
        $('body').trigger('filter:change',data);
    }
});