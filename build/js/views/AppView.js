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