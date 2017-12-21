'use strict';

function configureAxe() {
    // A custom check and rule are added to check for empty alt attributes.
    // Normally, empty alt attributes are meant for purely decorative purposes.
    // Since aXe is not reporting possible false positives, it does not consider this a violation.
    // Unfortunately, CKEditor saves an empty alt attribute when a user inserts an image
    // without specifying anything for alt, instead of not saving an alt attribute at all.
    // This custom rule will report a violation if an empty alt attribute is used for an
    // image with a width larger than 30 px.
    // Aside from that, the only rules used are WCAG2AA and WCAG2A.
    let checks = [
        {
            id: 'custom-alt-probably-ok',
            evaluate: function(node) {
                if (node.nodeName != 'IMG')
                    return true;
                let alt = node.getAttribute('alt');
                if (alt == null || alt != '')
                    return true; // another rule will catch that
                let width = node.getAttribute('width');
                if (width != null) {
                    width = parseInt(width);
                    if (!isNaN(width) && width < 30)
                        return true; // this could really be for decorative purpose
                }
                return false;
            }
        }
    ];
    let rules = axe.getRules(['wcag2aa', 'wcag2a']);
    rules.push({
        id: 'custom-check-img-alt-ok',
        selector: 'img',
        all: ['custom-alt-probably-ok'],
        tags: ['img']
    });
    axe.configure({
        branding: {
            application: "Mura Accessibility Plugin"
        },
        checks: checks,
        rules: rules
    });
}

function fixViolationStrings(violation) {
    if (violation.id == 'custom-check-img-alt-ok') {
        violation.description = 'Images must have alternate text';
        violation.help = 'Ensures <img> elements have alternate text or a role of none or presentation';
        violation.helpUrl = 'https://dequeuniversity.com/rules/axe/2.5/image-alt?application=axeAPI';
    }
}
