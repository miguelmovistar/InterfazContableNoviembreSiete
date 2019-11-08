using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Core.Metadata.Edm;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Reflection;


namespace IC2
{
    public static class DbContextSqlServerExtensions
    {
        public static void BulkInsert<TEntity>(this DbContext context, IList<TEntity> list, bool reloadEntities, string nombreEntidad) where TEntity : class
        {
           ExecuteBulkInsert<TEntity>(context, ref list, reloadEntities, nombreEntidad);
        }
        private static void ExecuteBulkInsert<TEntity>(DbContext context, ref IList<TEntity> list, bool reloadEntities, string nombreEntidad) where TEntity : class
        {
            Type typeOfEntity = typeof(TEntity);
            ObjectContext objectContext = ((IObjectContextAdapter)context).ObjectContext;
            //ReadOnlyMetadataCollection<EdmMember> storageSpaceMembers = objectContext.MetadataWorkspace.GetItem<EntityType>(@"ICPruebaModel.Store.NotaCredito" + typeOfEntity.Name, DataSpace.SSpace).Members;
            ReadOnlyMetadataCollection<EdmMember> storageSpaceMembers = objectContext.MetadataWorkspace.GetItem<EntityType>(@"ICPruebaModel.Store."+nombreEntidad , DataSpace.SSpace).Members;

            using (SqlBulkCopy sqlBulkCopy = new SqlBulkCopy(context.Database.Connection.ConnectionString))
            {
                using (DataTable dataTable = new DataTable())
                {
                    dataTable.Locale = CultureInfo.InvariantCulture;
                    //Cada columna se define en un espacio de almacenamiento de datos...
                    for (int index = 0; index < storageSpaceMembers.Count; index++)
                    {
                        // Se configura la instancia de la clase SqlBulkCopy con el nombre del origen y destino de columna...
                        sqlBulkCopy.ColumnMappings.Add(storageSpaceMembers[index].Name, storageSpaceMembers[index].Name);
                        
                       
                        dataTable.Columns.Add(storageSpaceMembers[index].Name, GetPropertyValue<Type>(storageSpaceMembers[index].TypeUsage.EdmType, @"ClrType"));
                    }

                    PopulateDataTable(dataTable, objectContext, list, storageSpaceMembers);

                    sqlBulkCopy.DestinationTableName = GetTableName(objectContext, typeOfEntity);
                    sqlBulkCopy.BatchSize = list.Count;
                    sqlBulkCopy.WriteToServer(dataTable);
                }
            }

            if (reloadEntities)
            {
                list = context.Set<TEntity>().ToList();
            }
        }
        private static TValue GetPropertyValue<TValue>(object element, string propertyName) where TValue : class
        {
            return element.GetType().GetProperty(propertyName, BindingFlags.NonPublic | BindingFlags.Public | BindingFlags.Instance).GetValue(element, null) as TValue;
        }
        private static void PopulateDataTable<TEnity>(DataTable dataTable, ObjectContext objectContext, IList<TEnity> list, ReadOnlyMetadataCollection<EdmMember> storageSpaceMembers) where TEnity : class
        {
            Type typeOfEntity = typeof(TEnity);
            ReadOnlyMetadataCollection<EdmMember> objectSpaceMembers = objectContext.MetadataWorkspace.GetItem<EntityType>(typeOfEntity.FullName, true, DataSpace.OSpace).Members;
            EntitySetBase entitySetBase = objectContext.MetadataWorkspace.GetEntityContainer(objectContext.DefaultContainerName, DataSpace.CSpace).BaseEntitySets.FirstOrDefault(baseEntitySet => baseEntitySet.ElementType.Name.Equals(typeOfEntity.Name, StringComparison.OrdinalIgnoreCase));
            EntityType entityType = (EntityType)entitySetBase.ElementType;
            foreach (TEnity entity in list)
            {
                DataRow dataRow = dataTable.NewRow();
                foreach (EdmProperty edmProperty in entityType.Properties)
                   dataRow[storageSpaceMembers[objectSpaceMembers.IndexOf(objectSpaceMembers[edmProperty.Name])].Name] = (GetPropertyValue<object>(entity, edmProperty.Name)==null)?DBNull.Value: GetPropertyValue<object>(entity, edmProperty.Name);
                
                if (entityType.NavigationProperties.Count > 0)
                {
                    ICollection<ReferentialConstraint> referentialConstraints = GetReferentialConstraints(objectContext, typeOfEntity, entitySetBase);

                    foreach (NavigationProperty navigationProperty in entityType.NavigationProperties)
                    {
                        IEnumerable<ReferentialConstraint> filteredReferentialConstraints = referentialConstraints.Where(referentialConstraint => referentialConstraint.FromRole.Name.Equals(navigationProperty.Name, StringComparison.OrdinalIgnoreCase));

                        foreach (ReferentialConstraint referentialConstraint in filteredReferentialConstraints)
                          dataRow[referentialConstraint.ToProperties[0].Name] = GetPropertyValue<object>(GetPropertyValue<object>(entity, referentialConstraint.FromRole.Name), referentialConstraint.FromProperties[0].Name);
                    }
                }

                dataTable.Rows.Add(dataRow);
            }
        }

        private static ICollection<ReferentialConstraint> GetReferentialConstraints(ObjectContext objectContext, Type entityType, EntitySetBase entitySetBase)
        {
            List<ReferentialConstraint> referentialConstraints = new List<ReferentialConstraint>();
            GlobalItem conceptToStorageItemCollection = objectContext.MetadataWorkspace.GetItemCollection(DataSpace.CSSpace).First();
            dynamic dynamicStorageTypeMappings = GetPropertyValue<dynamic>(conceptToStorageItemCollection.GetType().GetMethod("GetEntitySetMapping", BindingFlags.NonPublic | BindingFlags.Instance).Invoke(conceptToStorageItemCollection, new object[] { entitySetBase.Name }), "TypeMappings");

            foreach (object storageTypeMapping in dynamicStorageTypeMappings)
            {
                dynamic dynamicStorageMappingFragments = GetPropertyValue<dynamic>(storageTypeMapping, "MappingFragments");
                foreach (object storageMappingFragment in dynamicStorageMappingFragments)
                {
                    EntitySet tableSet = GetPropertyValue<EntitySet>(storageMappingFragment, "TableSet");
                    if (tableSet != null && tableSet.Name.Equals(entityType.Name, StringComparison.OrdinalIgnoreCase))
                        referentialConstraints.AddRange(GetPropertyValue<ICollection<Tuple<AssociationSet, ReferentialConstraint>>>(tableSet, "ForeignKeyDependents").Select(foreignKeyDependent => foreignKeyDependent.Item2));
                }
            }

            return referentialConstraints;
        }

        private static string GetTableName(ObjectContext objectContext, Type entityType)
        {
            return objectContext.MetadataWorkspace.GetItems<EntityContainer>(DataSpace.SSpace).FirstOrDefault().BaseEntitySets.FirstOrDefault(entityBaseSet => entityBaseSet.Name.Equals(entityType.Name, StringComparison.OrdinalIgnoreCase)).Name;
        }
    }
}