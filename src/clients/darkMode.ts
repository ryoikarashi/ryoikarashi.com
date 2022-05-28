export default class DarkMode {
    private readonly _toggleButtonId: string;
    private readonly _lightModeIconId: string;
    private readonly _darkModeIconId: string;
    private static readonly _darkModeClassName = 'dark';
    private static readonly _lightModeClassName = 'light';
    private static readonly _localStorageKey = 'theme';

    constructor(toggleButtonId = 'darkModeToggleButton', lightModeIconId = 'lightIcon', darkModeIconId = 'darkIcon') {
        this._toggleButtonId = toggleButtonId;
        this._lightModeIconId = lightModeIconId;
        this._darkModeIconId = darkModeIconId;
    }

    private getToggleButton() {
        return document.getElementById(this._toggleButtonId);
    }

    private getLightModeIcon() {
        return document.getElementById(this._lightModeIconId);
    }

    private getDarkModeIcon() {
        return document.getElementById(this._darkModeIconId);
    }

    private static isDarkMode() {
        return (
            localStorage.theme === this._darkModeClassName ||
            (!(this._localStorageKey in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
        );
    }

    private static toggleModeClass(isDarkMode: boolean) {
        if (isDarkMode) {
            document.documentElement.classList.add(DarkMode._darkModeClassName);
        } else {
            document.documentElement.classList.remove(DarkMode._darkModeClassName);
        }
    }

    private toggleIcon(isDarkMode: boolean) {
        if (isDarkMode) {
            this.getDarkModeIcon()?.classList.remove('hidden');
            this.getLightModeIcon()?.classList.add('hidden');
        } else {
            this.getDarkModeIcon()?.classList.add('hidden');
            this.getLightModeIcon()?.classList.remove('hidden');
        }
    }

    private static saveToLocalStorage(isDarkMode = true) {
        localStorage.theme = isDarkMode ? DarkMode._darkModeClassName : DarkMode._lightModeClassName;
    }

    private changeMode(isDarkMode: boolean) {
        DarkMode.toggleModeClass(isDarkMode);
        this.toggleIcon(isDarkMode);
        DarkMode.saveToLocalStorage(isDarkMode);
    }

    private setUpToggleButtonClickEvent() {
        this.getToggleButton()?.addEventListener('click', () => {
            this.changeMode(!DarkMode.isDarkMode());
        });
    }

    public init(): void {
        this.changeMode(DarkMode.isDarkMode());
        this.setUpToggleButtonClickEvent();
    }
}
