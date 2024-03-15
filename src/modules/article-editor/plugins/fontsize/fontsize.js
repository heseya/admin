ArticleEditor.add('plugin', 'fontsize', {
    translations: {
        'en': {
            "fontsize": {
                "title": "Text size",
                "remove":  "Remove text size"
            }
        }
    },
    init() {
        this.sizes = (this.opts.fontsize) ? this.opts.fontsize : ['10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '30px'];
    },
    start() {
        let button = {
            title: '## fontsize.title ##',
            icon: '<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.33667 3.33336C1.33667 2.87496 1.70827 2.50336 2.16667 2.50336H10.8333C11.2917 2.50336 11.6633 2.87496 11.6633 3.33336V4.66669C11.6633 5.12509 11.2917 5.49669 10.8333 5.49669C10.3749 5.49669 10.0033 5.12509 10.0033 4.66669V4.16336H7.66334V11.8367H8.16667C8.62507 11.8367 8.99667 12.2083 8.99667 12.6667C8.99667 13.1251 8.62507 13.4967 8.16667 13.4967H5.5C5.04161 13.4967 4.67 13.1251 4.67 12.6667C4.67 12.2083 5.04161 11.8367 5.5 11.8367H6.00334V4.16336H2.99667V4.66669C2.99667 5.12509 2.62507 5.49669 2.16667 5.49669C1.70827 5.49669 1.33667 5.12509 1.33667 4.66669V3.33336ZM9.33667 8.00002C9.33667 7.54163 9.70827 7.17002 10.1667 7.17002H14.1667C14.6251 7.17002 14.9967 7.54163 14.9967 8.00002V8.66669C14.9967 9.12509 14.6251 9.49669 14.1667 9.49669C13.7642 9.49669 13.4286 9.2102 13.3527 8.83002H12.9967V11.8528C13.3768 11.9286 13.6633 12.2642 13.6633 12.6667C13.6633 13.1251 13.2917 13.4967 12.8333 13.4967H11.5C11.0416 13.4967 10.67 13.1251 10.67 12.6667C10.67 12.2642 10.9565 11.9286 11.3367 11.8528V8.83002H10.9806C10.9047 9.2102 10.5692 9.49669 10.1667 9.49669C9.70827 9.49669 9.33667 9.12509 9.33667 8.66669V8.00002Z"/></svg>',
            blocks: {
                all: 'editable',
                except: ['code']
            },
            command: 'fontsize.popup'
        };

        this.app.toolbar.add('fontsize', button);
    },
    popup(e, button) {
        let buttons = {};
        for (let i = 0; i < this.sizes.length; i++) {
            let size = this.sizes[i];
            let params = { tag: 'span', style: { 'font-size': size }};
            let obj = {
                title: size,
                command: 'inline.set',
                params: params
            };

            buttons[i] = obj;
        }

        // remove font family
        buttons['remove'] = {
            title: '## fontsize.remove ##',
            divider: 'top',
            command: 'fontsize.remove'
        };

        this.app.popup.create('fontsize', {
            //width: '300px',
            items: buttons
        });
        this.app.popup.open({ button: button });
    },
    remove() {
        this.app.popup.close();

        let obj = { style: 'font-size' };
        this.app.inline.remove(obj);
    }
});