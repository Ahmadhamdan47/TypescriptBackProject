import { EquipmentBrandDatabaseInterface } from "../../src/database/interfaces/equipmentBrand.database";
import { NewBrandState } from "../../src/database/interfaces/brandState.database";
import { NewBrandActionType } from "../../src/database/interfaces/brandActionType.database";

export const brandsTypes: EquipmentBrandDatabaseInterface[] = [
  {
    id: 1,
    name: "Xellip1",
    equipmentTypeId: 1,
  },
  {
    id: 2,
    name: "Xellip2",
    equipmentTypeId: 2,
  },
  {
    id: 3,
    name: "MaylisV1",
    equipmentTypeId: 3,
  },
  {
    id: 4,
    name: "MaylisV2",
    equipmentTypeId: 3,
  },
];

export const newBrandsActionsTypes: NewBrandActionType[] = [
  {
    EquipmentBrandId: 1,
    ActionTypeId: 1,
  },
  {
    EquipmentBrandId: 1,
    ActionTypeId: 2,
  },
  {
    EquipmentBrandId: 2,
    ActionTypeId: 1,
  },
  {
    EquipmentBrandId: 2,
    ActionTypeId: 2,
  },
];

export const newBrandsStates: NewBrandState[] = [
  {
    EquipmentBrandId: 1,
    StateId: 1,
  },
  {
    EquipmentBrandId: 1,
    StateId: 2,
  },
  {
    EquipmentBrandId: 2,
    StateId: 1,
  },
  {
    EquipmentBrandId: 2,
    StateId: 2,
  },
  {
    EquipmentBrandId: 3,
    StateId: 1,
  },
  {
    EquipmentBrandId: 4,
    StateId: 1,
  },
];
