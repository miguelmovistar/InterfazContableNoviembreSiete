"use strict";

var PanelCustom = Ext.define("PanelCustom",
    {
        xtype: 'panelcustom',
        extend: 'Ext.panel.Panel',
        alias:'custom.panelcustom',
        border: false,
        closable: true,
        autoScroll:true,
        items: []
    });