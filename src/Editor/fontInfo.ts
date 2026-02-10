interface FontInfo {
  [fontName: string]: {
    [variant: string]: string[];
  };
}

interface FontFileArgs {
  font: string;
  variant?: string;
  weight?: string;
  callback?: (data: Blob) => void;
  error?: (error: any) => void;
}

function getBaseUrl(): string {
  const meta = import.meta as ImportMeta & { env?: { BASE_URL?: string } };
  return meta.env?.BASE_URL ?? "/";
}

class FontInfoInterface extends Object {
  private _allFontInfo: FontInfo;
  private editor: any;

  constructor(editor: any) {
    super();
    this._allFontInfo = {};

    this._getAllFontInfo();

    this.editor = editor;
  }

  _getAllFontInfo = (): void => {
    fetch(getBaseUrl() + "fonts/fontList.json")
      .then((response) => response.json())
      .then((data: FontInfo) => {
        this.allFontInfo = data;
      });
  };

  get allFontInfo(): FontInfo {
    return this._allFontInfo;
  }

  set allFontInfo(info: FontInfo) {
    this._allFontInfo = info;
  }

  /**
   * Returns all font names with existing fonts at the front of the array.
   * @returns {string[]} fonts that currently exist in the project.
   */
  get allFontNames(): string[] {
    let existingFonts: string[] = this.editor.getExistingFonts();

    existingFonts = existingFonts.sort(function (a: string, b: string) {
      return a.localeCompare(b);
    });

    let loadableFonts = Object.keys(this.allFontInfo);

    // Remove existing fonts from the list.
    existingFonts.forEach((font) => {
      const index = loadableFonts.indexOf(font);
      if (index > -1) {
        loadableFonts.splice(index, 1);
      }
    });

    return existingFonts.concat(loadableFonts);
  }

  /**
   * Returns the font variant information for a specific font.
   * @param {string} font font name
   * @returns {Object|undefined} object containing variant information. Returns undefined if font is not in the font list.
   */
  fontInfo(font: string): { [variant: string]: string[] } | undefined {
    return this.allFontInfo[font];
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
   * @param {string} variant variant name
   * @returns {string[]|undefined} returns a list of weights. returns undefined if the font or variant does not exist.
   */
  fontWeightsByVariant(font: string, variant: string): string[] | undefined {
    const info = this.fontInfo(font);
    return info ? info[variant] : undefined;
  }

  /**
   * Returns true if the given font is already loaded by the project.
   */
  hasFont(font: string): boolean {
    if (this.editor.hasFont) {
      return this.editor.hasFont(font);
    }
    return false;
  }

  /**
   * Returns a list of all existing fonts.
   */
  getExistingFonts(): string[] {
    if (this.editor.getExistingFonts) {
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
  getFontFile(args: FontFileArgs): void {
    if (!args.font) {
      console.error("No font supplied to getFontFile");
      return;
    }

    const font = args.font;
    const variant = args.variant || "regular";
    const weight = args.weight || "";

    const folderName = font + "/";
    const fontFileName = font + "_" + weight + variant + ".ttf";

    fetch(getBaseUrl() + "fonts/" + folderName + fontFileName)
      .then((response) => response.blob())
      .then((data: Blob) => {
        (data as any).hasFont = false;
        if (args.callback) args.callback(data);
      })
      .catch((error: any) => {
        if (args.error) args.error(error);
      });
  }
}

export default FontInfoInterface;
