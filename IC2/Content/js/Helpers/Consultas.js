'use strict'

var Help = {

    generarExtraParams: function(grid) {
        var ep = {};
        var proxy = grid.getStore().getProxy();
        Ext.each(grid.columns, function (columna) {
            if (columna.items.length > 0)
                ep[columna.dataIndex] = '';
        });
        proxy.extraParams = ep;
        return ep;
    },

    generarExtraParamsMulti: function (grids) {
        var ep = {};
        var eps = {};
        var existeCampoDeFiltrado = false;
        Ext.each(grids, function (grid) {
            ep = {};
            Ext.each(grid.columns, function (columna) {
                if (columna.items.length > 0) {
                    Ext.each(columna.items.items, function (item) {
                        if (item.xtype == 'textfield') {
                            ep[columna.dataIndex] = '';
                            existeCampoDeFiltrado = true;
                        }
                    });
                }
            });            
            if (existeCampoDeFiltrado) {
                eps['ep_' + grid.id] = ep;
                grid.getStore().getProxy().extraParams = ep;
            }
            existeCampoDeFiltrado = false;
        }); 
        return eps;
    },

    filtrarColumna: function (campo, paginador, extraParams) {
        var valor = campo.value;
        var columna = campo.up('gridcolumn');
        var grid = columna.up('gridpanel');
        console.log(columna.dataIndex + ': ' + valor);
        extraParams[columna.dataIndex] = valor;
        this.habilitarCamposDeFiltrado(grid.columns, false, campo);
        paginador.moveFirst();
        return campo;
    },

    habilitarCamposDeFiltrado: function (columnas, habilitar, campoTextoFiltrado) {
        Ext.each(columnas, function (col) {
            Ext.each(col.items.items, function (item) {
                if (item.xtype == 'textfield')
                    item.setDisabled(!habilitar);
            });
        });
        if (campoTextoFiltrado != null)
            campoTextoFiltrado.focus();
    }

};