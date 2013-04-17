var EntryView = Backbone.View.extend({
    el: '#entry',
    template: Mustache.compile($('#tmplEntry').html()),
    events: {
        "submit form": "processEntry",
        "form:reset": "resetForm"
    },
    initialize: function () {
        this.render();
    },
    render: function () {
        this.$el.html(this.template());
        $('#upload').on('load', this.parseResponse);
    },
    processEntry: function (e) {
        var data = this.$el.find('form').serializeObject();
        var errors = this.validateForm(data);
        console.log(data, errors);
        if (errors.length > 0) {
            e.preventDefault();
            this.showErrors(errors);
        }
    },
    validateForm: function (data) {
        var validEmail = /[A-Z0-9._+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i;
        var validUrl = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;

        var errors = [];
        if (data.name.length == 0) {
            errors.push({field: 'name', msg: 'Name is a required field'})
        }
        if (data.email.length == 0) {
            errors.push({field: 'email', msg: 'Email is a required field'})
        }
        if (!validEmail.test(data.email)) {
            errors.push({field: 'email', msg: 'A valid email is a required field'})
        }
        if (data.url.length > 0) {
            if (!validUrl.test(data.url)) {
                errors.push({field: 'url', msg: 'Url appear to be malformed, please review'})
            }
        }
        if (!data.tags || data.tags == "") {
            errors.push({field: 'tags', msg: 'Select 1 or more tags that describe you'})
        }
        if (data.tags instanceof Array) {
            if (data.tags.length > 3) {
                errors.push({field: 'tags', msg: 'The number of selected tags cannot exceed 3'})
            }
        }
        return errors;
    },
    showErrors: function (errors) {
        //console.log(errors);
    },
    parseResponse: function () {
        var res = $('#upload').contents().text();
        if (res) {
            try {
                res = JSON.parse(res);
            }
            catch (e) {
                // nom nom nom
            }

            // TODO: add error checking

            var creative = new Creative(res);

            $(this).trigger("creative:created", creative);
            $(this).trigger('form:reset');
        }
    },
    resetForm: function () {
        this.$el.find('form')[0].reset();
    }
});