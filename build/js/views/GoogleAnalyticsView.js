var GoogleAnalyticsView = Backbone.View.extend({
    el:'#tracker',
    trackEvent:function(category, label, action, value){
        //_gaq.push(['_trackEvent', category, label, action, value];
    },
    trackView:function(){
       // _gaq.push(['_trackPageview', location.pathname + location.search + location.hash]);
    }
});