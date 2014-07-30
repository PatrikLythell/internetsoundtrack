var $ = require('jquery');

$(document).ready(function() {
    var all = $('*');

    $('body').
    var nodeArr = [];
    $(all).each(function(i, el) {
        if ($(el).parents().length > 1) {
            el.childDepth = $(el).parents().length;
            nodeArr.push(el);
        }
    });
    console.log(nodeArr);
    $(nodeArr).each(function(i, el) {
        $(el).css('transform', 'translate3d(0, 0, ' + el.childDepth * 100 + 'px)');
        $(el).css('top', 200);
    });
});