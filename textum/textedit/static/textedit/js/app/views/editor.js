define(['backbone',
    'views/popup_file_loader',
    'webodf', // Init webodf viewer
], function (Backbone, Popup) {

    var Editor = Backbone.View.extend({
        pageHeight: 865,
        _current_page: 0,

        el: '.leftView',

        events: {
            'click #uploadButton': 'openFileLoader',
        },

        initialize: function () {
            console.log('new: Editor is created.');

            this.$webodf_wrapper = this.$('#webodf-wrapper');
            this.$webodf_element = this.$('#webodf-textarea');

            if (this.$webodf_element.length) {
                console.log('Loading webodf ...');
                // Init WebOdf Canvas
                this.$odfcanvas = new odf.OdfCanvas(this.$webodf_element[0]);
            } else {
                console.log("No Text Editor specified.")
            };

            this.listenTo(Backbone, 'Editor::uploadTextFile', function (odf_file_url) {
                this.updateTextFile(odf_file_url);
            }, this);

            this.listenTo(Backbone, 'Editor::showPage', function (pageNumber) {
                this.showPage(pageNumber);
            }, this);
        },

        openFileLoader: function () {
            if (this.popup == undefined) {
                this.popup = new Popup({type:'UploadFile'});
            } else {
                this.popup.show('UploadFile');
            }
        },

        showPage: function(pageNumber) {
            self._current_page = pageNumber;
            this.$webodf_wrapper.scrollTop(pageNumber * this.pageHeight);
        },

        pageScroller: function() {
            self = this;

            this.$webodf_wrapper.scroll(function() {
                p = (self.$webodf_wrapper.scrollTop() / (self.pageHeight - 100)) >> 0;
                _number_of_pages = Math.ceil($("#webodf-textarea").height() / self.pageHeight)

                if (self._current_page < p && self._current_page < _number_of_pages - 1 ) {
                    self._current_page = p;
                    Backbone.trigger('Image::showImage', self._current_page);
                };

                if (self._current_page > p) {
                    self._current_page = p;
                    Backbone.trigger('Image::showImage', self._current_page, p);
                };

            });
        },

        updateTextFile: function (odf_file_url) {
            self = this;
            if (self.$webodf_element.length) {
                self.$odfcanvas.load(odf_file_url);
                setTimeout(function() {self.$odfcanvas.fitToWidth(650);}, 1000);
                self.pageScroller();
            }
        }
    });

    return Editor;
});
