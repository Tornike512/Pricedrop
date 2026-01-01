import { Suspense } from "react";
import { CarsPage } from "@/components/cars-page";

export default function Home() {
  return (
    <Suspense>
      <CarsPage />
    </Suspense>
  );
}
