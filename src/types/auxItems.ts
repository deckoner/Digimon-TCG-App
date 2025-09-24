export interface BT {
  id: number;
  name: string;
  abbreviation: string;
}

export interface AuxItem {
  id: number;
  name: string;
}

export interface AuxData {
  bts: BT[];
  colors: AuxItem[];
  cardTypes: AuxItem[];
  rarities: AuxItem[];
  stages: AuxItem[];
  attributes: AuxItem[];
  types: AuxItem[];
}
