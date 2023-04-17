import { Suspense } from "react";
import { ThemeSwitcher } from "@/components/molecules";
import { PaliWord, Photo, Profile } from "@/components/organisms";

export default function Page() {
  return (
    <main
      className={`flex min-h-screen max-h-screen flex-col items-center justify-between p-4`}
    >
      <div className="w-full flex justify-between">
        <ThemeSwitcher />
        <PaliWord className="m-3" />
      </div>
      <div className="flex grow justify-center items-center w-full">
        <Suspense fallback={<Photo.Loading />}>
          {/* @ts-expect-error Server Component */}
          <Photo />
        </Suspense>
      </div>
      <Profile className="w-full" />
    </main>
  );
}
