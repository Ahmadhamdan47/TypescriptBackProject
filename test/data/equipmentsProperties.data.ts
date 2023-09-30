import { EquipmentTypeEquipmentPropertyDatabaseInterface } from "../../src/database/interfaces/equipmentTypeEquipmentProperty.database";
import { EquipmentPropertyDatabaseInterface } from "../../src/database/interfaces/equipmentProperty.database";
import { ConfigEquipmentTypeServerInterface } from "../../src/server/interfaces/configEquipmentType.server";

export const equipmentProperty1: EquipmentPropertyDatabaseInterface = {
  id: 1,
  name: "Variable liée à l'état général d'un interphone",
};
export const equipmentProperty2: EquipmentPropertyDatabaseInterface = {
  id: 2,
  name: "Variable pour la gestion des communications d'un interphone",
};
export const equipmentProperty3: EquipmentPropertyDatabaseInterface = {
  id: 3,
  name: "Variable liée aux actions d'un interphone",
};

export const equipmentsProperties: EquipmentPropertyDatabaseInterface[] = [
  equipmentProperty1,
  equipmentProperty2,
  equipmentProperty3,
];

export const equipmentTypeEquipmentProperty1: EquipmentTypeEquipmentPropertyDatabaseInterface =
  {
    EquipmentPropertyId: 1,
    EquipmentTypeId: 1,
  };

export const equipmentTypeEquipmentProperty2: EquipmentTypeEquipmentPropertyDatabaseInterface =
  {
    EquipmentPropertyId: 1,
    EquipmentTypeId: 2,
  };

export const equipmentTypeEquipmentProperty3: EquipmentTypeEquipmentPropertyDatabaseInterface =
  {
    EquipmentPropertyId: 2,
    EquipmentTypeId: 1,
  };

export const equipmentTypeEquipmentProperty4: EquipmentTypeEquipmentPropertyDatabaseInterface =
  {
    EquipmentPropertyId: 2,
    EquipmentTypeId: 2,
  };

export const equipmentTypeEquipmentProperty5: EquipmentTypeEquipmentPropertyDatabaseInterface =
  {
    EquipmentPropertyId: 2,
    EquipmentTypeId: 3,
  };

export const equipmentTypeEquipmentProperty6: EquipmentTypeEquipmentPropertyDatabaseInterface =
  {
    EquipmentPropertyId: 3,
    EquipmentTypeId: 1,
  };

export const equipmentTypeEquipmentProperty7: EquipmentTypeEquipmentPropertyDatabaseInterface =
  {
    EquipmentPropertyId: 3,
    EquipmentTypeId: 2,
  };

export const equipmentsTypesEquipmentsProperties: EquipmentTypeEquipmentPropertyDatabaseInterface[] =
  [
    equipmentTypeEquipmentProperty1,
    equipmentTypeEquipmentProperty2,
    equipmentTypeEquipmentProperty3,
    equipmentTypeEquipmentProperty4,
    equipmentTypeEquipmentProperty5,
    equipmentTypeEquipmentProperty6,
    equipmentTypeEquipmentProperty7,
  ];

export const configXellip1: ConfigEquipmentTypeServerInterface = {
  entityName: "Xellip1",
  entityIcon: "Xellip1.jpg",
  equipmentsProperties: [
    {
      name: "Variable liée à l'état général d'un interphone",
      states: [
        {
          name: "Open door",
          icon: "openDoor.jpg",
          gravity: 2,
          concernedBrands: ["Xellip1"],
          stateParam: [],
        },
      ],
      actionsTypes: [],
    },
    {
      name: "Variable pour la gestion des communications d'un interphone",
      states: [
        {
          name: "Communication",
          icon: "comm.jpg",
          gravity: 1,
          concernedBrands: ["Xellip1"],
          stateParam: [
            {
              id: "Intercom event",
              labelFr: "Evènement interphonie",
              labelEn: "Intercom event",
              type: "list",
              value: {
                values: [
                  {
                    id: "Repos",
                    labelFr: "Repos",
                    labelEn: "Pause",
                  },
                  {
                    id: "En communication",
                    labelFr: "En communication",
                    labelEn: "In communication",
                  },
                  {
                    id: "Déconnecté",
                    labelFr: "Déconnecté",
                    labelEn: "Disconnected",
                  },
                ],
              },
            },
          ],
        },
      ],
      actionsTypes: [],
    },
    {
      name: "Variable liée aux actions d'un interphone",
      states: [],
      actionsTypes: [
        {
          name: "Close door",
          concernedBrands: ["Xellip1"],
          actionParams: [
            {
              id: "State",
              labelFr: "Etat",
              labelEn: "State",
              value: {
                values: [
                  {
                    id: "Marche",
                    labelFr: "Marche",
                    labelEn: "Start",
                  },
                  {
                    id: "Arrêt",
                    labelFr: "Arrêt",
                    labelEn: "Stop",
                  },
                ],
                type: "list",
              },
            },
            {
              id: "Delay",
              labelFr: "Délai",
              labelEn: "Delay",
              value: {
                valueMin: 1,
                valueMax: 10,
                type: "int",
              },
            },
          ],
        },
        {
          name: "Call",
          concernedBrands: ["Xellip1"],
          actionParams: [],
        },
      ],
    },
  ],
};

export const configXellip2: ConfigEquipmentTypeServerInterface = {
  entityName: "Xellip2",
  entityIcon: "Xellip2.jpg",
  equipmentsProperties: [
    {
      name: "Variable liée à l'état général d'un interphone",
      states: [
        {
          name: "Open door",
          icon: "openDoor.jpg",
          gravity: 2,
          concernedBrands: ["Xellip2"],
          stateParam: [],
        },
      ],
      actionsTypes: [],
    },
    {
      name: "Variable pour la gestion des communications d'un interphone",
      states: [
        {
          name: "Communication",
          icon: "comm.jpg",
          gravity: 1,
          concernedBrands: ["Xellip2"],
          stateParam: [
            {
              id: "Intercom event",
              labelFr: "Evènement interphonie",
              labelEn: "Intercom event",
              type: "list",
              value: {
                values: [
                  {
                    id: "Repos",
                    labelFr: "Repos",
                    labelEn: "Pause",
                  },
                  {
                    id: "En communication",
                    labelFr: "En communication",
                    labelEn: "In communication",
                  },
                  {
                    id: "Déconnecté",
                    labelFr: "Déconnecté",
                    labelEn: "Disconnected",
                  },
                ],
              },
            },
          ],
        },
      ],
      actionsTypes: [],
    },
    {
      name: "Variable liée aux actions d'un interphone",
      states: [],
      actionsTypes: [
        {
          name: "Close door",
          concernedBrands: ["Xellip2"],
          actionParams: [
            {
              id: "State",
              labelFr: "Etat",
              labelEn: "State",
              value: {
                values: [
                  {
                    id: "Marche",
                    labelFr: "Marche",
                    labelEn: "Start",
                  },
                  {
                    id: "Arrêt",
                    labelFr: "Arrêt",
                    labelEn: "Stop",
                  },
                ],
                type: "list",
              },
            },
            {
              id: "Delay",
              labelFr: "Délai",
              labelEn: "Delay",
              value: {
                valueMin: 1,
                valueMax: 10,
                type: "int",
              },
            },
          ],
        },
        {
          name: "Call",
          concernedBrands: ["Xellip2"],
          actionParams: [],
        },
      ],
    },
  ],
};

export const configMaylis: ConfigEquipmentTypeServerInterface = {
  entityName: "Maylis",
  entityIcon: "Maylis.jpg",
  equipmentsProperties: [
    {
      name: "Variable pour la gestion des communications d'un interphone",
      states: [
        {
          name: "Communication",
          icon: "comm.jpg",
          gravity: 1,
          concernedBrands: ["MaylisV1", "MaylisV2"],
          stateParam: [
            {
              id: "Intercom event",
              labelFr: "Evènement interphonie",
              labelEn: "Intercom event",
              type: "list",
              value: {
                values: [
                  {
                    id: "Repos",
                    labelFr: "Repos",
                    labelEn: "Pause",
                  },
                  {
                    id: "En communication",
                    labelFr: "En communication",
                    labelEn: "In communication",
                  },
                  {
                    id: "Déconnecté",
                    labelFr: "Déconnecté",
                    labelEn: "Disconnected",
                  },
                ],
              },
            },
          ],
        },
      ],
      actionsTypes: [],
    },
  ],
};
