var EntryView = Backbone.View.extend({
    el: '#entry',
    template: Mustache.compile($('#tmplEntry').html()),
    events:{
        //"click .addCreative":"processEntry",
        "form:reset":"resetForm"
    },
    initialize: function(){
        this.render();
    },
    render:function(){
        this.$el.html(this.template());
        //this.$el.on('')
        $('#upload').on('load', this.parseResponse);
    },
    processEntry:function(e){
        e.preventDefault();
        var $form = this.$el.find('form');
        console.log($form.serializeArray());
    },
    parseResponse:function(e){
        var res = $('#upload').contents().text();
        console.log('parseResponse', res, this);
        if (res){
            try{
                res = JSON.parse(res);
            }
            catch (e){
                // nom nom nom
            }

            // TODO: add error checking

            var creative = new Creative(res);

            $(this).trigger("creative:created",creative);
            $(this).trigger('form:reset');
        }
    },
    resetForm:function(){
        this.$el.find('form')[0].reset();
    }
});