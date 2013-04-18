var GoogleAnalyticsView = Backbone.View.extend({
    el:'#tracker',
    trackEvent:function(category, label, action, value){
        console.log('bc.trackevent', category, label, action, value);
        //_gaq.push(['_trackEvent', category, label, action, value];
    },
    trackView:function(){
        console.log('bc.trackview', location.pathname + location.search + location.hash);
       // _gaq.push(['_trackPageview', location.pathname + location.search + location.hash]);
    }
});