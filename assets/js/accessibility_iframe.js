'use strict';

{
    let contentLoaded = function() {
        let muraBody = document.querySelector('.mura-body');
        if (muraBody == null)
            muraBody = document.querySelector('#mura-editable-attribute-body');
        if (muraBody == null) {
            parent.outputErrorMessageAndContinue(
                "Warning: no result for <a href=\"" + parent.accessibilityCurrentURL + "\">" +
                parent.accessibilityCurrentURL + "</a> (no element with the mura-body class)");
            return;
        }
        let context = muraBody;
        configureAxe();
        let options = {
            elementRef: true
        };
        axe.run(context, options).then(
            (results) => {
                parent.addViolationsAndContinue(results.violations);
            },
            (error) => {
                parent.outputErrorMessageAndContinue(error);
            }
        );
    }
    document.addEventListener('DOMContentLoaded', contentLoaded);
}
