export interface BuiltinAsset {
  file: string;
  name: string;
  icon?: string;
}

export interface BuiltinSoundAsset extends BuiltinAsset {
  credit: string;
  license: string;
  licenseLink: string;
  link: string;
}

export interface BuiltinCollection<TAsset extends BuiltinAsset = BuiltinAsset> {
  name: string;
  assets: TAsset[];
}
