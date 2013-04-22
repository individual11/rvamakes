var AppFooterView = Backbone.View.extend({
    el: "footer",
    events:{
        "click .random": "raiseRandom"
    },
    raiseRandom: function (e) {
        e.preventDefault();
        tracker.trackEvent('Navigation','Random','Click');
        $('body').trigger('creative:random');
    }
    
});