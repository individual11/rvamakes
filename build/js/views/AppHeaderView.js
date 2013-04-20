var AppHeaderView = Backbone.View.extend({
    el: "header",
    events: {
        "click .fob": "togglePanel",
        "click .options > div": "updateFilter",
        "click .prefix": "reset"
    },
    initialize: function () {

    },
    render: function () {

    },
    togglePanel: function () {
        this.$el.find('.options').fadeToggle(150);
    },
    updateFilter: function (e) {
        var $target = $(e.target);
        this.$el.find(".options").fadeToggle(100);
        window.location.hash = "#/filter/" + $target.data("filter");
    },
    setSelected:function(filter){
        this.$el.find(".options .selected").removeClass("selected");
        var title = this.$el.find(".options [data-filter="+filter+"]").addClass("selected").html(),
        	titleID = title.substr(0, title.length - 1).toLowerCase(),
        	$current = this.$el.find(".current");
        	
        if($current.data('current-state')){
	        $current.removeClass($current.data('current-state'));
        }
        $current.addClass(titleID).data('current-state', titleID).html(title);
    },
    reset: function () {
        window.location.hash = "#/filter/"
    }
});