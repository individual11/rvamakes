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