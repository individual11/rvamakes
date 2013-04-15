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