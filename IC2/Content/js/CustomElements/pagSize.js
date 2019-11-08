"use strict";

var pagSize = Ext.create('Ext.data.Store', {
    fields: ['id', 'size'],
    data: [
        { "id": "1", "size": "5" },
        { "id": "2", "size": "10" },
        { "id": "3", "size": "20" },
        { "id": "4", "size": "30" },
        { "id": "5", "size": "40" }
    ]
});