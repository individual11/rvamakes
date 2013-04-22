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
            tracker.trackEvent("Entry Form","Submit","Error Count",errors.length );
            this.showErrors(errors);
        }
        else{
            tracker.trackEvent("Entry Form","Submit","Valid");
        }
    },
    validateForm: function (data) {
        // validators
        var validEmail = /[A-Z0-9._+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i,
            validUrl = /^(http[s]?:\/\/){1,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/,
            validExt = /png|jpg|jpeg/;

        // retrieve file upload info
        var fileName = $('#form_img').val(),
            fileExt = fileName.substring(fileName.lastIndexOf('.')+1);

        // error list
        var errors = [];

        if (data.name.length == 0) {
            errors.push({field: 'name', msg: 'Name is a required field'})
        }
        if (!validEmail.test(data.email)) {
            errors.push({field: 'email', msg: 'A valid email is a required'})
        }
        if (data.url.length > 0) {
            if (!validUrl.test(data.url)) {
                errors.push({field: 'url', msg: 'URL appears to be malformed, please review'})
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
        if (!validExt.test(fileExt)){
            errors.push({field: 'img', msg: 'Please choose an image <small>(format: png or jpg)</small>'});
        }

        return errors;
    },
    showErrors: function (errors) {
        console.log(errors);
        var $form = this.$el.find('form');
        $form.find('.error').removeClass('error');
        $form.find('.errors').empty();
        var field, $field, $error;
        errors.forEach(function(error){
            field = '[name="'+error.field+'"]';
            if (error.field == 'tags'){
                field = 'fieldset';
                $field = $form.find(field);
                $error = $field.find('.errors');
            }
            else{
                field = '[name="'+error.field+'"]';
                $field = $form.find(field);
                $error = $field.siblings('.errors');
            }
            $field.addClass('error');
            $error.append("<p>"+error.msg+"</p>");
        });
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

            tracker.trackEvent("Entry Form","Submit","Success");
            $(this).trigger("creative:created", creative);
            $(this).trigger('form:reset');
        }
    },
    resetForm: function () {
        this.$el.find('form')[0].reset();
    }
});