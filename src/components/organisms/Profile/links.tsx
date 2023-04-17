import { List } from "@/components/molecules";

export function Links() {
  return (
    <List.TextList
      size="sm"
      items={[
        { label: "Sarara Software", url: "https://sarara.software" },
        { label: "Code", url: "https://github.com/ryoikarashi" },
        { label: "Music", url: "https://soundcloud.com/ryo_ikarashi" },
        {
          label: "Photos",
          url: "https://photos.app.goo.gl/E1ReiRfaKaBrfQCw8",
        },
        { label: "Email", url: "mailto:me@ryoikarashi.com" },
      ]}
    />
  );
}
