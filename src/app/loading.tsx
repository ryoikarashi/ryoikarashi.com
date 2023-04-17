import { Loading as LoadingComponent } from "@/components/atoms";

export default function Loading() {
  return (
    <div className="bg-white dark:bg-black transition duration-500">
      <div className="flex justify-center fixed inset-0">
        <div className="w-full min-h-screen flex justify-center items-center">
          <LoadingComponent />
        </div>
      </div>
    </div>
  );
}
