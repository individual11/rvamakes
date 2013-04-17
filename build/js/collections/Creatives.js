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