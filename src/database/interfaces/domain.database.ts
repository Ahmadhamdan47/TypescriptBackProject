export interface DomainDatabaseInterface {
  id: number;
  name: string;
  domainSystemId: number;
  parentDomainSystemId: number;
  systemId: number;
}

export type NewDomain = Omit<DomainDatabaseInterface, "id">;
