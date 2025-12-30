import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/config";

export type ManufacturerResponse = {
  man_id: number;
  name: string;
};

export type Manufacturer = {
  man_id: number;
  manufacturer_name: string;
};

export type ModelResponse = {
  model_id: number;
  man_id: number;
  name: string;
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

  const data = (await response.json()) as ManufacturerResponse[];
  return data.map((item) => ({
    man_id: item.man_id,
    manufacturer_name: item.name,
  }));
}

async function getModels(manId: number): Promise<Model[]> {
  const url = `${API_URL}/api/manufacturers/${manId}/models`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch models");
  }

  const data = (await response.json()) as ModelResponse[];
  return data.map((item) => ({
    model_id: item.model_id,
    man_id: item.man_id,
    model_name: item.name,
  }));
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
