import { QueryInterface } from "sequelize";

/**
 * Insert elements to table with createdAt and updatedAt
 * If elements have name, return ids
 * @param queryInterface
 * @param tableName
 * @param elements
 */
export async function insertElementsToTableReturnIdsByName(
  queryInterface: QueryInterface,
  tableName: string,
  elements: any[]
) {
  await queryInterface.bulkInsert(
    tableName,
    elements.map(element => ({
      ...element,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    {}
  );
  let ids: any[] = [];
  // check if elements have name
  if (elements[0].name) {
    ids = await Promise.all(
      elements.map(element =>
        selectElementIdFromName(queryInterface, tableName, element.name)
      )
    );
  }
  return ids;
}

/**
 *  Select id from tableName where name = name
 * @param queryInterface
 * @param tableName
 * @param name
 * @returns
 */
export async function selectElementIdFromName(
  queryInterface: QueryInterface,
  tableName: string,
  name: string
) {
  return await queryInterface.rawSelect(tableName, { where: { name } }, ["id"]);
}

export async function deleteTableElementFromName(
  queryInterface: QueryInterface,
  tableName: string,
  name: string[]
) {
  await queryInterface.bulkDelete(tableName, {
    where: { name },
  });
}
