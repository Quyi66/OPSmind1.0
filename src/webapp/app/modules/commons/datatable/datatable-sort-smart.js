$.fn.dataTable.ext.order['oplus-smart'] = function (settings, col,b,c) {
    console.log('oplus-smart',{settings:settings,col:col,b:b,c:c});
    return this.api().column(col, {order: 'index'}).nodes().map(function (td, i) {
        var elem = $('>[data-sort]', td);
        // if (elem.length){
        //     console.log(elem.data('sort'));
            return elem.data('sort');
        // }
        // if ($('>[data-sort]', td).length)
        //     return $('input', td).prop('checked') ? '1' : '0';
    });
};