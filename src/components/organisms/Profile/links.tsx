import React from 'react';
import { List } from '@/components/molecules';

export function Links(): JSX.Element {
  return (
    <List.TextList
      size='xs'
      items={[
        { label: 'Sarara Software', url: 'https://sarara.software' },
        { label: 'Code', url: 'https://github.com/ryoikarashi' },
        { label: 'Music', url: 'https://soundcloud.com/ryo_ikarashi' },
        {
          label: 'Photos',
          url: 'https://photos.app.goo.gl/E1ReiRfaKaBrfQCw8',
        },
        { label: 'Memorandums', url: 'https://m.ryoikarashi.com' },
        { label: 'Email', url: 'mailto:me@ryoikarashi.com' },
      ]}
    />
  );
}
