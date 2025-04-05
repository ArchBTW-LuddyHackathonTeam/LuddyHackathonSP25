export interface Node {
  id: number;
  titleValue?: string;
  numberValue?: number;
  attributes?: Attribute[];
  chooseNClasses?: number[];
  courseID?: number;
  dropdownChildren?: boolean;
  department?: string;
  preRecs: Node[];
}

export enum Attribute {
  AH = "A&H",
  SH = "S&H",
  WC = "World Culture",
  WL = "World Language",
  NM = "N&M",
  IW = "Intensive Writing",
  EC = "English Composition",
  MM = "Mathematical Modeling",
}
