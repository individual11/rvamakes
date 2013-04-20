var AppFooterView = Backbone.View.extend({
    el: "footer",
    events:{
	  "click .inner div a": "sectionChange"
    },
    initialize:function(){

    },
    render:function(){

    },
    sectionChange:function(){
	    $('.options').hide();
    }
    
});