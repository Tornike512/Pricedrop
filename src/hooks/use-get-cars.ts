import { useInfiniteQuery } from "@tanstack/react-query";
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
  predicted_price: number;
  has_predicted_price: boolean;
  pred_min_price: number;
  pred_max_price: number;
  manufacturer_name: string;
  model_name: string;
  created_at: string;
  updated_at: string;
  link: string;
};

export type CarsResponse = {
  items: Car[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
};

export type GetCarsParams = {
  man_id?: number | null;
  model_id?: number | null;
  fuel_type_id?: number | null;
  gear_type_id?: number | null;
  prod_year_from?: number | null;
  prod_year_to?: number | null;
  price_from?: number | null;
  price_to?: number | null;
  search?: string | null;
  page_size?: number;
  page?: number;
};

async function getCars(params?: GetCarsParams): Promise<CarsResponse> {
  const searchParams = new URLSearchParams();

  if (params?.man_id != null) searchParams.set("man_id", String(params.man_id));
  if (params?.model_id != null)
    searchParams.set("model_id", String(params.model_id));
  if (params?.fuel_type_id != null)
    searchParams.set("fuel_type_id", String(params.fuel_type_id));
  if (params?.gear_type_id != null)
    searchParams.set("gear_type_id", String(params.gear_type_id));
  if (params?.prod_year_from != null)
    searchParams.set("prod_year_from", String(params.prod_year_from));
  if (params?.prod_year_to != null)
    searchParams.set("prod_year_to", String(params.prod_year_to));
  if (params?.price_from != null)
    searchParams.set("price_from", String(params.price_from));
  if (params?.price_to != null)
    searchParams.set("price_to", String(params.price_to));
  if (params?.search) searchParams.set("search", params.search);
  searchParams.set("page_size", String(params?.page_size ?? 16));
  searchParams.set("page", String(params?.page ?? 1));

  const url = `${API_URL}/api/cars?${searchParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch cars");
  }

  return response.json() as Promise<CarsResponse>;
}

export function useGetCars(params?: Omit<GetCarsParams, "page">) {
  const pageSize = params?.page_size ?? 16;

  return useInfiniteQuery({
    queryKey: ["cars", params],
    queryFn: ({ pageParam = 1 }) =>
      getCars({ ...params, page_size: pageSize, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined;
    },
  });
}
