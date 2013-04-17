var Creative = Backbone.Model.extend({
    defaults: {
        name: "person name",
        img: "",
        url: "",
        tags: []
    },
    validation: {
        name: {
            required: true
        },
        email:{
            required: true,
            pattern: 'email'
        }
    }
});