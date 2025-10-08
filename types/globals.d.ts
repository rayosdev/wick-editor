declare module '*.scss' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module 'tinycolor2';
declare module 'react-color';
declare module 'react-color/lib/components/common';
declare module 'react-color/lib/components/sketch/SketchFields';
declare module 'react-modal';

// Wick Engine global
interface Window {
  Wick: any;
  editor: any;
}
