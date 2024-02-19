'use client';

import React, { type PropsWithChildren } from 'react';
import { useStore } from '@/stores';
import { Link } from '@/components/atoms';

export function WordLink({ children }: PropsWithChildren): JSX.Element {
  const isModalOpen = useStore((state) => state.isModalOpen);
  const updateModal = useStore((state) => state.updateModal);

  return (
    <>
      <Link
        href=''
        noUnderline
        onClick={(e) => {
          e.preventDefault();
          updateModal(!isModalOpen);
        }}
      >
        {children}
      </Link>
    </>
  );
}
