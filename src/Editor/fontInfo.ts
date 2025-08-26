export default class FontInfoInterface {
  editor: any;
  private _allFontInfo: Record<string, any>;

  constructor(editor: any) {
    this._allFontInfo = {};
    this.editor = editor;

    this._getAllFontInfo();
  }

  private _getAllFontInfo = (): void => {
    fetch(`${process.env.PUBLIC_URL}/fonts/fontList.json`)
      .then((response) => response.json())
      .then((data: Record<string, any>) => {
        this.allFontInfo = data;
      })
      .catch(() => {
        // Fail silently for now
      });
  };

  get allFontInfo(): Record<string, any> {
    return this._allFontInfo;
  }

  set allFontInfo(info: Record<string, any>) {
    this._allFontInfo = info;
  }

  /**
   * Returns all font names with existing fonts at the front of the array.
   * @returns {string[]} fonts that currently exist in the project.
   */
  get allFontNames(): string[] {
    const existingFonts: string[] = Array.isArray(this.getExistingFonts())
      ? this.getExistingFonts()
      : [];

    const sortedExisting = existingFonts.slice().sort((a: string, b: string) => a.localeCompare(b));

    const loadableFonts = Object.keys(this.allFontInfo || {});

    // Remove existing fonts from the list.
    sortedExisting.forEach((font) => {
      const index = loadableFonts.indexOf(font);
      if (index > -1) {
        loadableFonts.splice(index, 1);
      }
    });

    return sortedExisting.concat(loadableFonts);
  }

  /**
   * Returns the font variant information for a specific font.
   * @param {string} font font name
   * @returns {Object|undefined} object containing variant information. Returns undefined if font is not in the font list.
   */
  fontInfo(font: string): Record<string, any> | undefined {
    return this.allFontInfo ? this.allFontInfo[font] : undefined;
  }

  /**
   * Returns all font variant types such as regular and italic. 
   * @param {string} font font name
   * @returns {string[]} Font variants
   */
  fontVariants(font: string): string[] {
    const info = this.fontInfo(font);
    return info ? Object.keys(info) : [];
  }

  /**
   * Returns the font weights available for a particular variant.
   * @param {string} font font name
   * @param {*} variant variant name
   * @returns {string[]|undefined} returns a list of weights. returns undefined if the font or variant does not exist.
   */
  fontWeightsByVariant(font: string, variant: string): string[] | undefined {
    const info = this.fontInfo(font);
    if (!info) return undefined;
    return info[variant];
  }

  /**
   * Returns true if the given font is already loaded by the project.
   */
  hasFont(font: string): boolean {
    if (this.editor && typeof this.editor.hasFont === 'function') {
      return this.editor.hasFont(font);
    }
    return false;
  }

  /**
   * Returns a list of all existing fonts.
   */
  getExistingFonts(): string[] {
    if (this.editor && typeof this.editor.getExistingFonts === 'function') {
      return this.editor.getExistingFonts();
    }
    return [];
  }

  /**
   * Returns true if the given font exists in the project.
   */
  isExistingFont(font: string): boolean {
    return this.getExistingFonts().indexOf(font) > -1;
  }

  /**
   * Returns the font file as a blob.
   */
  getFontFile(args: { font?: string; variant?: string; weight?: string; callback?: (blob: any) => void; error?: (e: any) => void }): void {
    if (!args || !args.font) {
      console.error('No font supplied to getFontFile');
      return;
    }

    const font = args.font;
    const variant = args.variant || 'regular';
    const weight = args.weight || '';

    const folderName = font + '/';
    const fontFileName = `${font}_${weight}${variant}.ttf`;

    fetch(`${process.env.PUBLIC_URL}/fonts/${folderName}${fontFileName}`)
      .then((response) => response.blob())
      .then((data) => {
        const blob: any = data; // safe cast so we can add runtime metadata
        blob.hasFont = false;
        if (args.callback) args.callback(blob);
      })
      .catch((error) => {
        if (args.error) args.error(error);
      });
  }
}
