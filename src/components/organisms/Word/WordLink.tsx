"use client";

import { PropsWithChildren } from "react";
import { useStore } from "@/stores";
import { Link } from "@/components/atoms";

export function WordLink({ children }: PropsWithChildren) {
  const isModalOpen = useStore((state) => state.isModalOpen);
  const updateModal = useStore((state) => state.updateModal);

  return (
    <>
      <Link
        href=""
        noUnderline
        onClick={() => {
          updateModal(!isModalOpen);
        }}
      >
        {children}
      </Link>
    </>
  );
}
