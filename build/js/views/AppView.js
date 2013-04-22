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
        console.log('creative:show', data);
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
        console.log('filter:change',data);
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