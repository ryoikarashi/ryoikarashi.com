import React, { Suspense } from 'react';
import { type HTMLElementProps, Loading } from '@/components/atoms';
import { Modal } from '@/components/molecules';
import { WordExplanation } from './WordExplanation';
import { WordLink } from './WordLink';
import { Word } from './Word';

export type PaliWordProps = HTMLElementProps<HTMLDivElement>;

export function PaliWord(props: PaliWordProps): JSX.Element {
  return (
    <div {...props}>
      <WordLink>
        <Suspense
          fallback={<Loading.Placeholder className='!inline-block w-[100px]' />}
        >
          <Word />
        </Suspense>
      </WordLink>
      <Modal>
        <Suspense fallback={<Loading.Placeholder />}>
          <WordExplanation />
        </Suspense>
      </Modal>
    </div>
  );
}
