'use client';

import { Fragment, PropsWithChildren } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useStore } from '@/stores';

export function Modal(props: PropsWithChildren) {
  const isModalOpen = useStore((state) => state.isModalOpen);
  const updateModal = useStore((state) => state.updateModal);

  return (
    <Transition show={isModalOpen} as={Fragment}>
      <Dialog
        onClose={() => updateModal(false)}
        className='fixed inset-0 mx-auto flex max-h-screen min-h-screen max-w-3xl items-center justify-center'
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
          <Dialog.Panel>{props.children}</Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
