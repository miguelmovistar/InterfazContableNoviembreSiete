
function permisosElementos(controlador, lectura, nuevo, editar, eliminar, WLog) {
    if (lectura) {
        Ext.getCmp(lectura).hide();
    }
    if (nuevo) {
        Ext.getCmp(nuevo).hide();
    }
    if (editar) {
        Ext.getCmp(editar).hide();
    }
    if (eliminar) {
        Ext.getCmp(eliminar).hide();
    }


    Ext.define('model_permiso',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'CanRead', mapping: 'CanRead' },
                { name: 'CanNew', mapping: 'CanNew' },
                { name: 'CanEdit', mapping: 'CanEdit' },
                { name: 'CanDelete', mapping: 'CanDelete' },
                { name: 'WriteLog', mapping: 'WriteLog' }
            ]
        });


    var storePermiso = Ext.create('Ext.data.Store', {
        model: 'model_permiso',
        storeId: 'idstore_permiso',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Permisos/permisoControlador',
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success',
                totalProperty: 'total'
            },
            extraParams: {
                nombreControlador: controlador
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {
                if (request.proxy.reader.jsonData.success) {
                    if (request.proxy.reader.jsonData.CanRead == 1 && lectura) {
                        Ext.getCmp(lectura).show();
                    }

                    if (request.proxy.reader.jsonData.CanNew == 1 && nuevo) {
                        Ext.getCmp(nuevo).show();
                    }

                    if (request.proxy.reader.jsonData.CanEdit == 1 && editar) {
                        Ext.getCmp(editar).show();
                    }


                    if (request.proxy.reader.jsonData.CanDelete == 1 && eliminar) {
                        Ext.getCmp(eliminar).show();
                    }


                } else {
                    Ext.MessageBox.show({
                        title: "tInformacionSistema",
                        msg: "Ocurrió un error: " + request.proxy.reader.jsonData.results,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }




            }
        }

    });



}



function permisosVariosElementos(controlador, lectura, nuevo, editar, eliminar, WLog) {
    if (lectura && lectura.length > 0) {
        for (var i = 0; i < lectura.length; i++) {
            Ext.getCmp(lectura[i]).hide();
        }

    }
    if (nuevo && nuevo.length > 0) {
        for (var i = 0; i < nuevo.length; i++) {
            Ext.getCmp(nuevo[i]).hide();
        }

    }
    if (editar && editar.length > 0) {
        for (var i = 0; i < editar.length; i++) {
            Ext.getCmp(editar[i]).hide();
        }

    }
    if (eliminar && eliminar.length > 0) {
        for (var i = 0; i < eliminar.length; i++) {
            Ext.getCmp(eliminar[i]).hide();
        }
    }


    Ext.define('model_permiso',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'CanRead', mapping: 'CanRead' },
                { name: 'CanNew', mapping: 'CanNew' },
                { name: 'CanEdit', mapping: 'CanEdit' },
                { name: 'CanDelete', mapping: 'CanDelete' },
                { name: 'WriteLog', mapping: 'WriteLog' }
            ]
        });


    var storePermiso = Ext.create('Ext.data.Store', {
        model: 'model_permiso',
        storeId: 'idstore_permiso',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'Permisos/permisoControlador',
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success',
                totalProperty: 'total'
            },
            extraParams: {
                nombreControlador: controlador
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {
                if (request.proxy.reader.jsonData.success) {
                    if (request.proxy.reader.jsonData.CanRead == 1 && lectura) {

                        for (var i = 0; i < lectura.length; i++) {
                            Ext.getCmp(lectura[i]).show();
                        }

                    }

                    if (request.proxy.reader.jsonData.CanNew == 1 && nuevo) {

                        for (var i = 0; i < nuevo.length; i++) {

                            Ext.getCmp(nuevo[i]).show();
                        }

                    }

                    if (request.proxy.reader.jsonData.CanEdit == 1 && editar) {

                        for (var i = 0; i < editar.length; i++) {
                            Ext.getCmp(editar[i]).show();
                        }

                    }


                    if (request.proxy.reader.jsonData.CanDelete == 1 && eliminar) {

                        for (var i = 0; i < eliminar.length; i++) {
                            Ext.getCmp(eliminar[i]).show();
                        }

                    }


                } else {
                    Ext.MessageBox.show({
                        title: "tInformacionSistema",
                        msg: "Ocurrió un error: " + request.proxy.reader.jsonData.results,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }




            }
        }

    });



}