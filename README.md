# Mura Accessibility Plugin
A Mura 7 plugin to check a whole site accessibility, and to report issues for each page.

This plugin is based on Deque Labs's [aXe](https://github.com/dequelabs/axe-core).

To use it, make sure you are logged on the front-end side (use <kbd>esc-L</kbd> on any page to display the login form).

From the admin side, the plugin will let you check all pages in the site, and report violations.
On front-end, the plugin will add a badge on top right when a user is logged in. It reports the number of violations in the page. Clicking on it will display the list of violations, and clicking on a node will scroll the document to it and highlight it, making a fix easy with inline edit.

AXe is configured to use the WCAG2AA and WCAG2A rules. It will not report potential false positives.

A custom rule has been added to check for empty alt attributes.
Normally, empty alt attributes are meant for purely decorative purposes.
Since aXe is not reporting possible false positives, it does not consider this a violation.
Unfortunately, CKEditor (the default Mura content editor) saves an empty alt attribute
when a user inserts an image without specifying anything for alt,
instead of not saving an alt attribute at all (which would be considered a violation).
The custom rule will report a violation if an empty alt attribute is used for an
image with a width larger than 30 px, which is unlikely to be used purely for decorative purposes.

Note that CKEditor's [Accessibility Checker](https://ckeditor.com/cke4/addon/a11ychecker) can also be used in Mura to check accessibility, and it is complementary to this plugin. Accessibility Checker's implementation is based on [Quail](http://quailjs.org/), so it might report different violations. It will also report potential violations and warnings, while this plugin does not.
