ArticleEditor.add('plugin', 'fontcolor', {
    translations: {
        'en': {
            "fontcolor": {
                "title": "Text color",
                "remove":  "Remove color",
                "text": "Text",
                "background": "Background"
            }
        }
    },
    init() {
        let colors = {
            gray:   ['#212529', '#343a40', '#495057', '#868e96', '#adb5bd', '#ced4da', '#dee2e6', '#e9ecef', '#f1f3f5', '#f8f9fa'],
            red:    ["#c92a2a", "#e03131", "#f03e3e", "#fa5252", "#ff6b6b", "#ff8787", "#ffa8a8", "#ffc9c9", "#ffe3e3", "#fff5f5"],
            pink:   ["#a61e4d", "#c2255c", "#d6336c", "#e64980", "#f06595", "#f783ac", "#faa2c1", "#fcc2d7", "#ffdeeb", "#fff0f6"],
            grape:  ["#862e9c", "#9c36b5", "#ae3ec9", "#be4bdb", "#cc5de8", "#da77f2", "#e599f7", "#eebefa", "#f3d9fa", "#f8f0fc"],
            violet: ["#5f3dc4", "#6741d9", "#7048e8", "#7950f2", "#845ef7", "#9775fa", "#b197fc", "#d0bfff", "#e5dbff", "#f3f0ff"],
            indigo: ["#364fc7", "#3b5bdb", "#4263eb", "#4c6ef5", "#5c7cfa", "#748ffc", "#91a7ff", "#bac8ff", "#dbe4ff", "#edf2ff"],
            blue:   ["#1864ab", "#1971c2", "#1c7ed6", "#228be6", "#339af0", "#4dabf7", "#74c0fc", "#a5d8ff", "#d0ebff", "#e7f5ff"],
            cyan:   ["#0b7285", "#0c8599", "#1098ad", "#15aabf", "#22b8cf", "#3bc9db", "#66d9e8", "#99e9f2", "#c5f6fa", "#e3fafc"],
            teal:   ["#087f5b", "#099268", "#0ca678", "#12b886", "#20c997", "#38d9a9", "#63e6be", "#96f2d7", "#c3fae8", "#e6fcf5"],
            green:  ["#2b8a3e", "#2f9e44", "#37b24d", "#40c057", "#51cf66", "#69db7c", "#8ce99a", "#b2f2bb", "#d3f9d8", "#ebfbee"],
            lime:   ["#5c940d", "#66a80f", "#74b816", "#82c91e", "#94d82d", "#a9e34b", "#c0eb75", "#d8f5a2", "#e9fac8", "#f4fce3"],
            yellow: ["#e67700", "#f08c00", "#f59f00", "#fab005", "#fcc419", "#ffd43b", "#ffe066", "#ffec99", "#fff3bf", "#fff9db"],
            orange: ["#d9480f", "#e8590c", "#f76707", "#fd7e14", "#ff922b", "#ffa94d", "#ffc078", "#ffd8a8", "#ffe8cc", "#fff4e6"]
        };


        this.colors = (this.opts.fontcolor) ? this.opts.fontcolor : colors;
    },
    start() {
        let button = {
            title: '## fontcolor.title ##',
            color: true,
            icon: '<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.50002 4.16336C8.18972 4.16336 7.89213 4.28662 7.67271 4.50604C7.45329 4.72546 7.33002 5.02305 7.33002 5.33336V6.50336H9.67002V5.33336C9.67002 5.02305 9.54676 4.72546 9.32734 4.50604C9.10792 4.28662 8.81033 4.16336 8.50002 4.16336ZM11.33 5.33336C11.33 4.58279 11.0319 3.86297 10.5011 3.33224C9.97041 2.80152 9.25059 2.50336 8.50002 2.50336C7.74946 2.50336 7.02964 2.80152 6.49891 3.33224C5.96818 3.86297 5.67002 4.58279 5.67002 5.33336V10C5.67002 10.4584 6.04163 10.83 6.50002 10.83C6.95842 10.83 7.33002 10.4584 7.33002 10V8.16336H9.67002V10C9.67002 10.4584 10.0416 10.83 10.5 10.83C10.9584 10.83 11.33 10.4584 11.33 10V5.33336ZM3.00336 12.6667C3.00336 12.2083 3.37496 11.8367 3.83336 11.8367H13.1667C13.6251 11.8367 13.9967 12.2083 13.9967 12.6667C13.9967 13.1251 13.6251 13.4967 13.1667 13.4967H3.83336C3.37496 13.4967 3.00336 13.1251 3.00336 12.6667Z"/></svg>',
            blocks: {
                all: 'editable',
                except: ['code']
            },
            command: 'fontcolor.popup'
        };

        this.app.toolbar.add('fontcolor', button);
    },
    popup(e, button) {
        let inlines = this.app.selection.getNodes({ type: 'inline' });

        this.currentColor = false;
        this.currentBackgroundColor = false;

        if (inlines) {
            let $inline = this.dom(inlines[0]);
            let style = this.app.utils.cssToObject($inline.attr('style'));
            this.currentColor = (style.color) ? style.color : this.currentColor;
            this.currentBackgroundColor = (style.background) ? style.background : this.currentBackgroundColor;
        }

        let $dropdown = this.dom('<div class="' + this.prefix + '-dropdown-cells">');

        this.$selector = this._buildSelector();

        this.$selectorText = this._buildSelectorItem('text', this.lang.get('fontcolor.text'));
        this.$selectorText.addClass('active');

        this.$selectorBack = this._buildSelectorItem('back', this.lang.get('fontcolor.background'));

        this.$selector.append(this.$selectorText);
        this.$selector.append(this.$selectorBack);

        this.$pickerText = this._buildPicker('textcolor');
        this.$pickerBack = this._buildPicker('backcolor');

        let width = Object.keys(this.colors).length * 20;

        $dropdown.append(this.$selector);
        $dropdown.append(this.$pickerText);
        $dropdown.append(this.$pickerBack);
        $dropdown.width(width);

        this._buildSelectorEvents();

        this.app.popup.create('fontcolor', {
            width: width + 'px',
            html: $dropdown
        });
        this.app.popup.open({ button: button });
    },

    // =private
    _remove(type) {
        this.app.popup.close();

        let obj = (type === 'color') ? { style: 'color' } : { style: 'background' };
        this.app.inline.remove(obj);
    },
    _buildSelector() {
        let $selector = this.dom('<div>');
        $selector.addClass(this.prefix + '-dropdown-selector');

        return $selector;
    },
    _buildSelectorItem(name, title) {
        let $item = this.dom('<span>');
        $item.attr('rel', name).html(title);
        $item.addClass(this.prefix + '-dropdown-not-close');

        return $item;
    },
    _buildSelectorEvents() {
        this.$selectorText.on('click', function(e) {
            e.preventDefault();

            this.$selector.find('span').removeClass('active');
            this.$pickerBack.hide();
            this.$pickerText.show();
            this.$selectorText.addClass('active');

        }.bind(this));

        this.$selectorBack.on('click', function(e) {
            e.preventDefault();

            this.$selector.find('span').removeClass('active');
            this.$pickerText.hide();
            this.$pickerBack.show();
            this.$selectorBack.addClass('active');

        }.bind(this));
    },
    _buildPicker(name) {
        var $box = this.dom('<div class="' + this.prefix + '-dropdown-box-' + name + '">');
        var $colorBox = this.dom('<div class="' + this.prefix + '-form-colors-box">');
        var rule = (name == 'backcolor') ? 'background' : 'color';
        var len = this.colors.length;
        var self = this;

        for (let [key, item] of Object.entries(this.colors)) {
            var $div = this.dom('<div class="' + this.prefix + '-form-colors">');

            for (var i = 0; i < item.length; i++) {
                var color = item[i];
                var $swatch = this.dom('<a href="#">');
                $swatch.attr({ 'rel': color, 'data-rule': rule });
                $swatch.css({ 'background-color': color, 'font-size': 0, 'width': '20px', 'height': '20px' });
                $swatch.on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    var $el = this.dom(e.target);
                    let color = $el.attr('rel');
                    let style = ($el.data('rule') === 'color') ? { 'color': color } : { 'background': color };
                    let params = { tag: 'span', style: style };

                    this.app.event.trigger = false;
                    this.app.inline.set(params);
                    setTimeout(function() {
                        this.app.event.trigger = true;
                    }.bind(this), 100);
                }.bind(this));

                if (rule === 'color' && this.currentColor === color) {
                    $swatch.addClass('active');
                }
                if (rule === 'background' && this.currentBackgroundColor === color) {
                    $swatch.addClass('active');
                }

                $div.append($swatch);
            }

            $colorBox.append($div);
        }

        $box.append($colorBox);

        var $el = this.dom('<div>').addClass(this.prefix + '-dropdown-remove-item');
        var $link = this.dom('<a>');
        $link.attr({ 'href': '#' });
        $link.html(this.lang.get('fontcolor.remove'));
        $link.on('click', function(e) {
            e.preventDefault();
            self._remove(rule);
        });

        $el.append($link);
        $box.append($el);

        if (name == 'backcolor') $box.hide();

        return $box;
    }

});