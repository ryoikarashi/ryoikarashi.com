'use client';

import React, { Fragment, type PropsWithChildren, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useStore } from '@/stores';

export function Modal(props: PropsWithChildren): JSX.Element {
  const isModalOpen = useStore((state) => state.isModalOpen);
  const updateModal = useStore((state) => state.updateModal);
  const ref = useRef(null);

  return (
    <Transition show={isModalOpen} as={Fragment} ref={ref}>
      <Dialog
        onClose={() => {
          updateModal(false);
        }}
        initialFocus={ref}
        className='fixed inset-0 mx-auto flex h-full max-w-3xl items-center justify-center'
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 -z-10 bg-white/95 dark:bg-black/95' />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <Dialog.Panel className='w-10/12 text-center'>
            {props.children}
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
