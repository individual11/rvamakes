var Creative=Backbone.Model.extend({defaults:{name:"person name",img:"",url:"",tags:[]}}),Creatives=Backbone.Collection.extend({model:Creative,url:"api/creatives",randomId:function(){var e=this.models.length,t=Math.floor(Math.random()*e);return this.models[t].get("_id")}}),AppHeaderView=Backbone.View.extend({el:"header",events:{"click .fob":"togglePanel","click .options > div":"updateFilter","click .prefix":"reset"},initialize:function(){},render:function(){},togglePanel:function(){this.$el.find(".options").fadeToggle(150)},updateFilter:function(e){var t=$(e.target);this.$el.find(".options").fadeToggle(100);window.location.hash="#/filter/"+t.data("filter")},setSelected:function(e){var t="removeClass",n="selected",r="current-state";this.$el.find(".options .selected")[t](n);var i=this.$el.find(".options [data-filter="+e+"]").addClass(n).html(),s=i.substr(0,i.length-1).toLowerCase(),o=this.$el.find(".current");o.data(r)&&o[t](o.data(r));o.addClass(s).data(r,s).html(i)},reset:function(){window.location.replace("#/filter/")}}),AppFooterView=Backbone.View.extend({el:"footer",initialize:function(){},render:function(){}}),ListView=Backbone.View.extend({el:"#list",template:Mustache.compile($("#tmplListItem").html()),initialize:function(){var e=Modernizr.touch,t=navigator.userAgent||navigator.vendor||window.opera,n=/chrome/i.test(t.toLowerCase());e&&n&&(e=!1);e&&this.$el.addClass("touch");this.listenTo(this.collection,"add update remove refresh reset",this.render)},render:function(){var e=this;e.$el.empty();var t=null;this.collection.models.forEach(function(n){t=new ListItemView({model:n});e.$el.append(t.el)})},filterByTag:function(e){this.$el.attr("class","clearfix "+e.toLowerCase())},clearFilter:function(){this.$el.attr("class","clearfix")}}),ListItemView=Backbone.View.extend({tagName:"div",template:Mustache.compile($("#tmplListItem").html()),events:{click:"click",tap:"click"},initialize:function(){this.render()},render:function(){var e="item "+this.model.get("tags").join(" ");this.$el.addClass(e).html(this.template(this.model.toJSON()))},click:function(e){var t=this.$el.find("a").attr("href");window.location.hash=t}}),AboutView=Backbone.View.extend({el:"#about",template:Mustache.compile($("#tmplAbout").html()),initialize:function(){this.render()},render:function(){this.$el.html(this.template())}}),ShowView=Backbone.View.extend({el:"#show",template:Mustache.compile($("#tmplShowItem").html()),renderCreative:function(e){this.$el.html(this.template(e))}}),EntryView=Backbone.View.extend({el:"#entry",template:Mustache.compile($("#tmplEntry").html()),events:{"submit form":"processEntry","form:reset":"resetForm"},initialize:function(){this.render()},render:function(){this.$el.html(this.template());$("#upload").on("load",this.parseResponse)},processEntry:function(e){var t="trackEvent",n="Entry Form",r="Submit",i=this.$el.find("form").serializeObject(),s=this.validateForm(i);if(s.length>0){e.preventDefault();tracker[t](n,r,"Error Count",s.length);this.showErrors(s)}else tracker[t](n,r,"Valid")},validateForm:function(e){var t="length",n="push",r="tags",i=/[A-Z0-9._+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i,s=/^(http[s]?:\/\/){1,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/,o=/png|jpg|jpeg/,u=$("#form_img").val(),a=u.substring(u.lastIndexOf(".")+1),f=[];e.name[t]==0&&f[n]({field:"name",msg:"Name is a required field"});i.test(e.email)||f[n]({field:"email",msg:"A valid email is a required"});e.url[t]>0&&(s.test(e.url)||f[n]({field:"url",msg:"URL appears to be malformed, please review"}));(!e[r]||e[r]=="")&&f[n]({field:r,msg:"Select 1 or more tags that describe you"});e[r]instanceof Array&&e[r][t]>3&&f[n]({field:r,msg:"The number of selected tags cannot exceed 3"});o.test(a)||f[n]({field:"img",msg:"Please choose an image <small>(format: png or jpg)</small>"});return f},showErrors:function(e){var t="find",n="error",r=".errors",i='[name="',s=this.$el[t]("form");s[t](".error").removeClass(n);s[t](r).empty();var o,u,a;e.forEach(function(e){o=i+e.field+'"]';if(e.field=="tags"){o="fieldset";u=s[t](o);a=u[t](r)}else{o=i+e.field+'"]';u=s[t](o);a=u.siblings(r)}u.addClass(n);a.append("<p>"+e.msg+"</p>")})},parseResponse:function(){var e=$("#upload").contents().text();if(e){try{e=JSON.parse(e)}catch(t){}var n=new Creative(e);tracker.trackEvent("Entry Form","Submit","Success");$(this).trigger("creative:created",n);$(this).trigger("form:reset")}},resetForm:function(){this.$el.find("form")[0].reset()}}),GoogleAnalyticsView=Backbone.View.extend({el:"#tracker",trackEvent:function(e,t,n,r){},trackView:function(){}}),AppView=Backbone.View.extend({el:"body",initialize:function(){var e="creatives",t="collections",n="views";this.router=new AppRouter;this[t][e]=new Creatives;this[t][e].fetch({success:function(){Backbone.history.start()}});this[n].header=new AppHeaderView({});this[n].footer=new AppFooterView({});this[n].list=new ListView({collection:this[t][e]});this[n].show=new ShowView({});this[n].about=new AboutView({});this[n].entry=new EntryView({})},render:function(){},events:{"creative:created":"creative:created","creative:show":"creative:show","creative:random":"creative:random","filter:clear":"filter:clear","filter:change":"filter:change"},collections:{},views:{},"creative:created":function(e,t){if(t instanceof Creative){this.collections.creatives.add(t);this.router.navigate("#/show/"+t.get("_id"),!0)}},"creative:show":function(e,t){if(t=="")this.router.navigate("#/",{trigger:!0,replace:!0});else{var n=this.collections.creatives.findWhere({_id:t});this.views.show.renderCreative(n.toJSON())}},"creative:random":function(){this.router.navigate("#/show/"+this.collections.creatives.randomId(),{trigger:!0,replace:!1})},"filter:clear":function(){this.views.list.clearFilter()},"filter:change":function(e,t){if(t==""){this.router.navigate("#/",{trigger:!0,replace:!0});this.views.list.clearFilter();this.views.header.setSelected(t)}else{this.views.list.filterByTag(t);this.views.header.setSelected(t)}}}),AppRouter=Backbone.Router.extend({routes:{list:"list",about:"about",entry:"entry","show/:id":"show",random:"random","filter/(:tag)":"filter","*path":"defaultRoute"},hideSections:function(){$("section").hide();$("header .options").hide();window.scrollTo(0,1)},defaultRoute:function(){this.list()},list:function(){tracker.trackView();this.hideSections();$("body").trigger("filter:clear");$("#list").show()},about:function(){tracker.trackView();this.hideSections();$("#about").show()},entry:function(){tracker.trackView();this.hideSections();$("#entry").show()},show:function(e){tracker.trackView();$("body").trigger("creative:show",e);this.hideSections();$("#show").show()},random:function(){tracker.trackView();$("body").trigger("creative:random")},filter:function(e){tracker.trackView();e||(e="");this.hideSections();$("body").trigger("filter:change",e);$("#list").show()}}),_gaq=_gaq||[];_gaq.push(["_setAccount","UA-40190168-1"]);_gaq.push(["_setDomainName","rvamakes.com"]);var tracker=new GoogleAnalyticsView,app=new AppView;