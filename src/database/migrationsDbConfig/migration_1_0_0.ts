import { QueryInterface } from "sequelize";
import { AUTH_MODE, NODE_ENV_TEST } from "../../server/resources/constants";
import getRandomValues from "get-random-values";
import {
  deleteTableElementFromName,
  insertElementsToTableReturnIdsByName,
} from "./migration_tools";
import { EnumScheduledJobsNames } from "../../server/jobs/initScheduling.server.job";
import { permissionsConstants } from "../../server/middlewares/permissions.server.middleware";

export const purgedays = 30;
/**
 *
 * @param queryInterface
 */
export async function up_dbConfig_to_V1_0_0(
  queryInterface: QueryInterface
): Promise<void> {
  await queryInterface.sequelize.transaction(async () => {
    try {
      const userIds = await insertElementsToTableReturnIdsByName(
        queryInterface,
        "users",
        [
          {
            name: "xtvision",
            description: "Default user",
            language: "fr",
            time_zone: "UTC+1",
          },
        ]
      );

      const roleIds = await insertElementsToTableReturnIdsByName(
        queryInterface,
        "roles",
        [
          // TODO: translate names and descriptions
          { name: "Configuration", description: "Configuration" },
          { name: "Exploitation", description: "Exploitation" },
        ]
      );

      const featureIds = await insertElementsToTableReturnIdsByName(
        queryInterface,
        "features",
        Object.values(permissionsConstants)
          .map(value =>
            // TODO: discuss and translate names and descriptions
            Object.values(value).map(value => ({
              name: value,
              description: value,
            }))
          )
          .flat()
      );

      await insertElementsToTableReturnIdsByName(
        queryInterface,
        "roles_users",
        roleIds.map(roleId => ({
          UserId: userIds[0],
          RoleId: roleId,
        }))
      );

      // Link role "Configuration"/features

      await insertElementsToTableReturnIdsByName(
        queryInterface,
        "roles_features",
        featureIds.map(featureId => ({
          FeatureId: featureId,
          RoleId: roleIds[0],
        }))
      );

      if (process.env.NODE_ENV === NODE_ENV_TEST) {
        await insertElementsToTableReturnIdsByName(
          queryInterface,
          "managementAreas",
          [
            // TODO: translate names and descriptions
            { name: "unit 1", description: "unit 1" },
            { name: "unit 2", description: "unit 2" },
          ]
        );

        const dashboardIds = await insertElementsToTableReturnIdsByName(
          queryInterface,
          "dashboards",
          [
            {
              // TODO: translate names and descriptions
              name: "first dash",
              description: "first dash",
              layout: JSON.stringify({
                lg: [{ i: "1", x: 0, y: 0, w: 12, h: 24, minW: 6, minH: 9 }],
                md: [{ i: "1", x: 0, y: 0, w: 10, h: 24, minW: 6, minH: 9 }],
                sm: [{ i: "1", x: 0, y: 0, w: 6, h: 24, minW: 6, minH: 9 }],
                xs: [{ i: "1", x: 0, y: 0, w: 4, h: 24, minW: 2, minH: 9 }],
                xxs: [{ i: "1", x: 0, y: 0, w: 2, h: 15, minW: 2, minH: 9 }],
              }),
              widgets: JSON.stringify({ id: "1", type: "info-thread" }),
            },
          ]
        );

        await insertElementsToTableReturnIdsByName(
          queryInterface,
          "dashboards_users",
          [{ UserId: userIds[0], DashboardId: dashboardIds[0] }]
        );
      }

      await insertElementsToTableReturnIdsByName(
        queryInterface,
        "applicationParameters",
        [
          {
            counter: Math.floor(Math.random() * 10000),
            value: Array.from(getRandomValues(new Uint8Array(32)))
              .map(b => b.toString(16).padStart(2, "0"))
              .join(""),
          },
        ]
      );
      await insertElementsToTableReturnIdsByName(
        queryInterface,
        "authenticationParameters",
        [
          {
            mode: AUTH_MODE.OAUTH2_LOCAL,
          },
        ]
      );
      await insertElementsToTableReturnIdsByName(
        queryInterface,
        "scheduledJobs",
        [
          {
            name: "purge old userActions",
            description: "purge old userActions every day at 2:00:00am",
            task: EnumScheduledJobsNames.purgeOldUserActions,
            cron: "0 0 2 ? * * *",
            active: true,
            param1: 30,
          },
        ]
      );
      await insertElementsToTableReturnIdsByName(
        queryInterface,
        "scheduledJobs",
        [
          {
            // TODO: translate names and descriptions
            name: "daily backup",
            description: "backup databases every day at 2:00:00am",
            task: EnumScheduledJobsNames.backupDatabases,
            cron: "0 0 2 ? * * *",
            active: true,
          },
        ]
      );
    } catch (error) {
      return error;
    }
  });
}

/**
 *
 * @param queryInterface
 */
export async function up_dbExploit_to_V1_0_0(
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

export async function up_dbSystem_to_V1_0_0(
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

/**
 * Theoretically, this function should be used to downgrade the database to the previous version.
 * As we are in version 1.0.0, there is no previous version. So this function is only an example.
 * @param queryInterface
 */
export async function down_dbConfig_from_V1_0_0(
  queryInterface: QueryInterface
): Promise<void> {
  await queryInterface.sequelize.transaction(async () => {
    try {
      await deleteTableElementFromName(queryInterface, "users", ["xtvision"]);
      await deleteTableElementFromName(queryInterface, "roles", [
        "Configuration",
        "Exploitation",
      ]);
      await deleteTableElementFromName(queryInterface, "features", []);
      if (process.env.NODE_ENV === NODE_ENV_TEST) {
        await deleteTableElementFromName(queryInterface, "managementAreas", [
          "unit 1",
          "unit 2",
        ]);
        await deleteTableElementFromName(queryInterface, "dashboards", [
          "first dash",
        ]);
      }
      await deleteTableElementFromName(
        queryInterface,
        "applicationParameters",
        []
      );
      await deleteTableElementFromName(
        queryInterface,
        "authenticationParameters",
        []
      );
      await deleteTableElementFromName(queryInterface, "scheduledJobs", []);
    } catch (error) {
      return error;
    }
  });
}

/**
 * Theoretically, this function should be used to downgrade the database to the previous version.
 * As we are in version 1.0.0, there is no previous version. So this function is only an example.
 * @param queryInterface
 */
export async function down_dbExploit_from_V1_0_0(
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
export async function down_dbSystem_from_V1_0_0(
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
