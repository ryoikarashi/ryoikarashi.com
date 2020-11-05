export default class ClickSound {
    private readonly _audioElementId: string;

    constructor(audioElementId: string) {
        this._audioElementId = audioElementId;
    }

    public playClickSound(): void {
        const clickSound = document.getElementById(this._audioElementId) as HTMLMediaElement;
        if (!clickSound) {
            return;
        }
        clickSound.muted = false;
        clickSound.volume = 0.05;
        Array.from(document.querySelectorAll('a')).map((item) => {
            item.addEventListener(
                'mouseenter',
                async () => {
                    await clickSound.play();
                },
                false,
            );

            item.addEventListener(
                'mouseleave',
                async () => {
                    await clickSound.pause();
                    clickSound.currentTime = 0;
                },
                false,
            );
        });
    }
}
