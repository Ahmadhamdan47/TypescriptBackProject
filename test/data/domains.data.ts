import { DomainDatabaseInterface } from "../../src/database/interfaces/domain.database";
import { DomainServerInterface } from "../../src/server/interfaces/domain.server";

export const domain1: DomainDatabaseInterface = {
  id: 1,
  name: "Domaine parent",
  domainSystemId: 0,
  parentDomainSystemId: 0,
  systemId: 1,
};

export const domain2: DomainServerInterface = {
  id: 0,
  name: "Domaine parent",
  parentId: 0,
};
