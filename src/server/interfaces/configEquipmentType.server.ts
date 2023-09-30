export interface ConfigEquipmentTypeServerInterface {
  entityName: string;
  entityIcon: string;
  equipmentsProperties: EquipmentPropertyServerInterface[];
}

export interface EquipmentPropertyServerInterface {
  name: string;
  states: StateServerInterface[];
  actionsTypes: ActionTypeServerInterface[];
}

export interface StateServerInterface {
  name: string;
  icon: string;
  gravity: number;
  concernedBrands: string[];
  stateParam: EventParamServerInterface[];
}

export interface ActionTypeServerInterface {
  name: string;
  concernedBrands: string[];
  actionParams: ActionParamServerInterface[];
}

export interface EventParamServerInterface {
  id: string;
  labelFr: string;
  labelEn: string;
  type: string;
  value:
    | EventValueListInterface
    | EventValueIntInterface
    | EventValueStringInterface
    | string
    | undefined;
}

export interface ActionParamServerInterface {
  id: string;
  labelFr: string;
  labelEn: string;
  value:
    | ActionValueListInterface
    | ActionValueIntInterface
    | ActionValueStringInterface
    | string
    | undefined;
}

export interface EventValueListInterface {
  values: EventValueEnumInterface[];
}

export interface EventValueEnumInterface {
  id: string;
  labelFr: string;
  labelEn: string;
}

export interface EventValueIntInterface {
  valueMin: number;
  valueMax: number;
}

export interface EventValueStringInterface {
  maxLength: number;
}

export interface ActionValueListInterface {
  values: ActionValueEnumInterface[];
  type: string;
}

export interface ActionValueEnumInterface {
  id: string;
  labelFr: string;
  labelEn: string;
}

export interface ActionValueIntInterface {
  valueMin: number;
  valueMax: number;
  type: string;
}

export interface ActionValueStringInterface {
  maxLength: number;
  type: string;
}
