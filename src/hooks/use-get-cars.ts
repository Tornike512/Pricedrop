import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/config";

export type Car = {
  car_id: number;
  man_id: number;
  model_id: number;
  prod_year: number;
  price_usd: number;
  price_value: number;
  car_run_km: number;
  engine_volume: number;
  fuel_type_id: number;
  gear_type_id: number;
  car_desc: string;
  order_date: string;
  views: number;
  predicted_price: number | null;
  has_predicted_price: boolean;
  pred_min_price: number | null;
  pred_max_price: number | null;
  photo: string;
  manufacturer_name: string | null;
  model_name: string | null;
  created_at: string;
  updated_at: string;
  link: string;
  image_url: string;
};

export type CarsResponse = {
  items: Car[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
};

export type SortOption = "newest" | "oldest" | "price_asc" | "price_desc";

export type GetCarsParams = {
  man_id?: number | null;
  model_id?: number | null;
  fuel_type_ids?: number[] | null;
  gear_type_ids?: number[] | null;
  prod_year_from?: number | null;
  prod_year_to?: number | null;
  price_from?: number | null;
  price_to?: number | null;
  mileage_max?: number | null;
  engine_volume_min?: number | null;
  engine_volume_max?: number | null;
  deals_only?: boolean | null;
  search?: string | null;
  sort?: SortOption | null;
  page_size?: number;
  page?: number;
};

async function getCars(params?: GetCarsParams): Promise<CarsResponse> {
  const searchParams = new URLSearchParams();

  if (params?.man_id != null) searchParams.set("man_id", String(params.man_id));
  if (params?.model_id != null)
    searchParams.set("model_id", String(params.model_id));
  if (params?.fuel_type_ids?.length)
    searchParams.set("fuel_type_ids", params.fuel_type_ids.join(","));
  if (params?.gear_type_ids?.length)
    searchParams.set("gear_type_ids", params.gear_type_ids.join(","));
  if (params?.prod_year_from != null)
    searchParams.set("prod_year_from", String(params.prod_year_from));
  if (params?.prod_year_to != null)
    searchParams.set("prod_year_to", String(params.prod_year_to));
  if (params?.price_from != null)
    searchParams.set("price_from", String(params.price_from));
  if (params?.price_to != null)
    searchParams.set("price_to", String(params.price_to));
  if (params?.mileage_max != null)
    searchParams.set("mileage_max", String(params.mileage_max));
  // Convert centiliters to liters for backend (frontend uses centiliters: 1500 = 1.5L)
  if (params?.engine_volume_min != null)
    searchParams.set(
      "engine_volume_min",
      String(params.engine_volume_min / 1000),
    );
  if (params?.engine_volume_max != null)
    searchParams.set(
      "engine_volume_max",
      String(params.engine_volume_max / 1000),
    );
  if (params?.deals_only) searchParams.set("deals_only", "true");
  if (params?.search) searchParams.set("search", params.search);
  if (params?.sort) searchParams.set("sort", params.sort);
  searchParams.set("page_size", String(params?.page_size ?? 16));
  searchParams.set("page", String(params?.page ?? 1));

  const url = `${API_URL}/api/cars?${searchParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch cars");
  }

  return response.json() as Promise<CarsResponse>;
}

// Polling intervals in milliseconds
export const POLLING_INTERVAL_FAST = 10 * 1000; // 10 seconds - default check interval
export const POLLING_INTERVAL_SLOW = 60 * 1000; // 60 seconds - after new data found

export function useGetCars(
  params?: GetCarsParams,
  pollingInterval: number | false = POLLING_INTERVAL_FAST,
) {
  return useQuery({
    queryKey: ["cars", params],
    queryFn: () => getCars(params),
    refetchInterval: pollingInterval,
    refetchIntervalInBackground: false,
  });
}
