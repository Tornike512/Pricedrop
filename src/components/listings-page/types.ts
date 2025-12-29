import type { LookupMap } from "@/components/car-card";
import type { Car } from "@/hooks/use-get-cars";

export type SortOption =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "mileage_asc"
  | "best_deals";

export type ViewMode = "grid" | "list";

export type ListingsPageProps = {
  items: Car[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading?: boolean;
  lookup: LookupMap;
  sortBy?: SortOption;
  viewMode?: ViewMode;
  favorites?: Set<number>;
  onSortChange?: (sort: SortOption) => void;
  onPageChange?: (page: number) => void;
  onViewChange?: (view: ViewMode) => void;
  onFavoriteToggle?: (carId: number, isFavorite: boolean) => void;
};

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "mileage_asc", label: "Mileage: Low to High" },
  { value: "best_deals", label: "Best Deals" },
];
