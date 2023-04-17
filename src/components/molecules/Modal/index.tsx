"use client";

import { Fragment, PropsWithChildren } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useStore } from "@/stores";

export function Modal(props: PropsWithChildren) {
  const isModalOpen = useStore((state) => state.isModalOpen);
  const updateModal = useStore((state) => state.updateModal);

  return (
    <Transition show={isModalOpen} as={Fragment}>
      <Dialog
        onClose={() => updateModal(false)}
        className="flex fixed inset-0 justify-center items-center min-h-screen max-h-screen max-w-3xl mx-auto"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white/95 dark:bg-black/95 -z-10" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Panel>{props.children}</Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
