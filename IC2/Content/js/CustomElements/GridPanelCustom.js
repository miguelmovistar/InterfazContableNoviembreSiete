"use strict";

var GridPanelCustom = Ext.define("GridPanelCustom",
    {
        extend:'Ext.grid.Panel',
        xtype: 'gridpanelcustom',
        alias: 'custom.gridpanel',
        flex: 1,
        width: '100%',
        height: 300,
        columnLines: true,
        pageSize: 1,
        scrollable: true,
        selectable: {
            columns: false,
            extensible: true
        },
        columns: []
    }
);