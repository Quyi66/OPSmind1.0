/**
 * JQuery extension
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/04/20
 */
(function ($) {
    /**
     * Check if an element class match an expression
     * @param {RegExp|String} regex
     * @returns {boolean}
     */
    $.fn.hasClassMatch = function (regex) {
        var classes = $(this).attr('class');
        if (!classes || !regex) return false;
        classes = classes.split(/\s+/);

        for (var i = 0, len = classes.length; i < len; i++)
            if (classes[i].match(regex)) return true;

        return false;
    };
    /**
     * Remove element class matching an expression
     * @param {RegExp|String} regex
     */
    $.fn.removeClassMatch = function (regex) {
        return this.each(function () {
            var classes = $(this).attr('class');
            if (!classes || !regex) return false;

            var classArray = [];
            classes = classes.split(/\s+/);

            for (var i = 0, len = classes.length; i < len; i++)
                if (!classes[i].match(regex)) classArray.push(classes[i]);

            $(this).attr('class', classArray.join(' '));
        });
    }
})(jQuery);