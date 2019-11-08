"use strict";

var AjaxCustom = {
    realizarCalculo: function (periodo, url, callbackFunc) {
        Ext.Ajax.request({
            url: url,
            params: {periodo:periodo},
            success: function (response) {
                callbackFunc(response);
            }
        });
    }
};