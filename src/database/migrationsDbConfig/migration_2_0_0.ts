import { QueryInterface /*, DataTypes */ } from "sequelize";

export async function up_dbConfig_to_V2_0_0(
  queryInterface: QueryInterface
): Promise<void> {
  await queryInterface.sequelize.transaction(async () => {
    try {
      // Commented code underneeth is an example of how to create a new table and add a column to an existing table, using sequelize
      // Create new 2.0.0 table
      /* This is done automatically by sequelize */
      // Add "color" column to "tests" table
      /* await queryInterface.addColumn("tests", "color", {
        type: DataTypes.STRING,
      }); */
    } catch (error) {
      return error;
    }
  });
}
export async function up_dbExploit_to_V2_0_0(
  queryInterface: QueryInterface
): Promise<void> {
  await queryInterface.sequelize.transaction(async () => {
    try {
      // empty by now
    } catch (error) {
      return error;
    }
  });
}
export async function up_dbSystem_to_V2_0_0(
  queryInterface: QueryInterface
): Promise<void> {
  await queryInterface.sequelize.transaction(async () => {
    try {
      // empty by now
    } catch (error) {
      return error;
    }
  });
}

export async function down_dbConfig_from_V2_0_0(
  queryInterface: QueryInterface
): Promise<void> {
  await queryInterface.sequelize.transaction(async () => {
    try {
      // Commented code underneeth is an example of how to delete a table and delete a column from an existing table, using sequelize
      // Delete new 2.0.0 table
      /* await queryInterface.dropTable("tests", { force: true }); */
      // Delete "color" column from "tests" table
      /* await queryInterface.removeColumn("tests", "color"); */
    } catch (error) {
      return error;
    }
  });
}

export async function down_dbExploit_from_V2_0_0(
  queryInterface: QueryInterface
): Promise<void> {
  await queryInterface.sequelize.transaction(async () => {
    try {
      // empty by now
    } catch (error) {
      return error;
    }
  });
}

export async function down_dbSystem_from_V2_0_0(
  queryInterface: QueryInterface
): Promise<void> {
  await queryInterface.sequelize.transaction(async () => {
    try {
      // empty by now
    } catch (error) {
      return error;
    }
  });
}
