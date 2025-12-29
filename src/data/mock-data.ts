import type { LookupMap } from "@/components/car-card";
import type {
  LookupItem,
  Manufacturer,
  Model,
} from "@/components/filter-panel";

export const MANUFACTURERS: Manufacturer[] = [
  { man_id: 1, manufacturer_name: "Toyota" },
  { man_id: 2, manufacturer_name: "Honda" },
  { man_id: 3, manufacturer_name: "BMW" },
  { man_id: 4, manufacturer_name: "Mercedes-Benz" },
  { man_id: 5, manufacturer_name: "Audi" },
  { man_id: 6, manufacturer_name: "Volkswagen" },
  { man_id: 7, manufacturer_name: "Ford" },
  { man_id: 8, manufacturer_name: "Hyundai" },
  { man_id: 9, manufacturer_name: "Kia" },
  { man_id: 10, manufacturer_name: "Nissan" },
  { man_id: 11, manufacturer_name: "Mazda" },
  { man_id: 12, manufacturer_name: "Subaru" },
  { man_id: 13, manufacturer_name: "Lexus" },
  { man_id: 14, manufacturer_name: "Porsche" },
  { man_id: 15, manufacturer_name: "Chevrolet" },
];

export const MODELS: Model[] = [
  // Toyota
  { model_id: 1, man_id: 1, model_name: "Camry" },
  { model_id: 2, man_id: 1, model_name: "Corolla" },
  { model_id: 3, man_id: 1, model_name: "RAV4" },
  { model_id: 4, man_id: 1, model_name: "Prius" },
  { model_id: 5, man_id: 1, model_name: "Land Cruiser" },
  // Honda
  { model_id: 6, man_id: 2, model_name: "Civic" },
  { model_id: 7, man_id: 2, model_name: "Accord" },
  { model_id: 8, man_id: 2, model_name: "CR-V" },
  { model_id: 9, man_id: 2, model_name: "Pilot" },
  // BMW
  { model_id: 10, man_id: 3, model_name: "3 Series" },
  { model_id: 11, man_id: 3, model_name: "5 Series" },
  { model_id: 12, man_id: 3, model_name: "X3" },
  { model_id: 13, man_id: 3, model_name: "X5" },
  // Mercedes-Benz
  { model_id: 14, man_id: 4, model_name: "C-Class" },
  { model_id: 15, man_id: 4, model_name: "E-Class" },
  { model_id: 16, man_id: 4, model_name: "GLC" },
  { model_id: 17, man_id: 4, model_name: "S-Class" },
  // Audi
  { model_id: 18, man_id: 5, model_name: "A4" },
  { model_id: 19, man_id: 5, model_name: "A6" },
  { model_id: 20, man_id: 5, model_name: "Q5" },
  { model_id: 21, man_id: 5, model_name: "Q7" },
  // Volkswagen
  { model_id: 22, man_id: 6, model_name: "Golf" },
  { model_id: 23, man_id: 6, model_name: "Passat" },
  { model_id: 24, man_id: 6, model_name: "Tiguan" },
  // Ford
  { model_id: 25, man_id: 7, model_name: "Mustang" },
  { model_id: 26, man_id: 7, model_name: "F-150" },
  { model_id: 27, man_id: 7, model_name: "Explorer" },
  // Hyundai
  { model_id: 28, man_id: 8, model_name: "Elantra" },
  { model_id: 29, man_id: 8, model_name: "Sonata" },
  { model_id: 30, man_id: 8, model_name: "Tucson" },
  // Kia
  { model_id: 31, man_id: 9, model_name: "Sportage" },
  { model_id: 32, man_id: 9, model_name: "Sorento" },
  { model_id: 33, man_id: 9, model_name: "K5" },
  // Nissan
  { model_id: 34, man_id: 10, model_name: "Altima" },
  { model_id: 35, man_id: 10, model_name: "Rogue" },
  { model_id: 36, man_id: 10, model_name: "Pathfinder" },
  // Mazda
  { model_id: 37, man_id: 11, model_name: "Mazda3" },
  { model_id: 38, man_id: 11, model_name: "Mazda6" },
  { model_id: 39, man_id: 11, model_name: "CX-5" },
  // Subaru
  { model_id: 40, man_id: 12, model_name: "Outback" },
  { model_id: 41, man_id: 12, model_name: "Forester" },
  { model_id: 42, man_id: 12, model_name: "Impreza" },
  // Lexus
  { model_id: 43, man_id: 13, model_name: "ES" },
  { model_id: 44, man_id: 13, model_name: "RX" },
  { model_id: 45, man_id: 13, model_name: "NX" },
  // Porsche
  { model_id: 46, man_id: 14, model_name: "911" },
  { model_id: 47, man_id: 14, model_name: "Cayenne" },
  { model_id: 48, man_id: 14, model_name: "Macan" },
  // Chevrolet
  { model_id: 49, man_id: 15, model_name: "Camaro" },
  { model_id: 50, man_id: 15, model_name: "Silverado" },
  { model_id: 51, man_id: 15, model_name: "Equinox" },
];

export const FUEL_TYPES: LookupItem[] = [
  { id: 1, label: "Petrol" },
  { id: 2, label: "Diesel" },
  { id: 3, label: "Hybrid" },
  { id: 4, label: "Electric" },
  { id: 5, label: "LPG" },
  { id: 6, label: "CNG" },
];

export const GEAR_TYPES: LookupItem[] = [
  { id: 1, label: "Manual" },
  { id: 2, label: "Automatic" },
  { id: 3, label: "Tiptronic" },
  { id: 4, label: "CVT" },
];

// Lookup map for CarCard component
export const LOOKUP_MAP: LookupMap = {
  fuelTypes: FUEL_TYPES.reduce(
    (acc, item) => {
      acc[item.id] = item.label;
      return acc;
    },
    {} as Record<number, string>,
  ),
  gearTypes: GEAR_TYPES.reduce(
    (acc, item) => {
      acc[item.id] = item.label;
      return acc;
    },
    {} as Record<number, string>,
  ),
};
