export type Manufacturer = {
  man_id: number;
  manufacturer_name: string;
};

export type Model = {
  model_id: number;
  man_id: number;
  model_name: string;
};

export type LookupItem = {
  id: number;
  label: string;
};

export type FilterState = {
  priceMin: number | null;
  priceMax: number | null;
  manufacturerId: number | null;
  modelId: number | null;
  yearMin: number | null;
  yearMax: number | null;
  mileageMax: number | null;
  engineVolumeMin: number | null;
  engineVolumeMax: number | null;
  fuelTypeIds: number[];
  gearTypeIds: number[];
  dealsOnly: boolean;
};

export type FilterPanelProps = {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  manufacturers: Manufacturer[];
  models: Model[];
  fuelTypes: LookupItem[];
  gearTypes: LookupItem[];
  applyOnChange?: boolean;
  priceRange?: { min: number; max: number };
  yearRange?: { min: number; max: number };
  mileageRange?: { min: number; max: number };
  engineVolumeRange?: { min: number; max: number };
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const DEFAULT_FILTERS: FilterState = {
  priceMin: null,
  priceMax: null,
  manufacturerId: null,
  modelId: null,
  yearMin: null,
  yearMax: null,
  mileageMax: null,
  engineVolumeMin: null,
  engineVolumeMax: null,
  fuelTypeIds: [],
  gearTypeIds: [],
  dealsOnly: false,
};
