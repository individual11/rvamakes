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