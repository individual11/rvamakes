var AppView = Backbone.View.extend({
    el: "body",
    initialize:function(){
        this.collections.creatives = new Creatives();
        this.collections.creatives.fetch();

        this.views.header = new AppHeaderView({});
        this.views.footer = new AppFooterView({});
        this.views.list = new ListView({collection: this.collections.creatives});
        this.views.show = new ShowView({});
    },
    render:function(){
z
    },
    events:{
        "creative:create": "creative:create",
        "creative:show": "creative:show",
        "filter:change": "filter:change"
    },
    collections:{},
    views:{},
    "creative:create": function(e, data){

    },
    "creative:show": function(e, data){

    },
    "filter:change": function(e,data){
        console.log(data);
    }
});