/*global define*/
define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    'use strict';

    var TImage = Backbone.Model.extend({
        defaults: {
            title: '',
            url: '',
            page_num: ''
        }
    });

    return TImage;
});