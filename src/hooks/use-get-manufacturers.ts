import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/config";

export type Manufacturer = {
  man_id: number;
  manufacturer_name: string;
};

export type Model = {
  model_id: number;
  man_id: number;
  model_name: string;
};

async function getManufacturers(): Promise<Manufacturer[]> {
  const url = `${API_URL}/api/manufacturers`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch manufacturers");
  }

  return response.json() as Promise<Manufacturer[]>;
}

async function getModels(manId: number): Promise<Model[]> {
  const url = `${API_URL}/api/manufacturers/${manId}/models`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch models");
  }

  return response.json() as Promise<Model[]>;
}

export function useGetManufacturers() {
  return useQuery({
    queryKey: ["manufacturers"],
    queryFn: getManufacturers,
    staleTime: 1000 * 60 * 30, // 30 minutes - manufacturers rarely change
  });
}

export function useGetModels(manId: number | null) {
  return useQuery({
    queryKey: ["models", manId],
    queryFn: () => getModels(manId!),
    enabled: manId !== null,
    staleTime: 1000 * 60 * 30, // 30 minutes - models rarely change
  });
}
