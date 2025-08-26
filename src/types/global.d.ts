/// <reference types="vite/client" />

// Global type declarations

// Window object extensions
declare global {
  interface Window {
    Wick: any;
    wick: any;
    editor: any;
    project: any;
    paper: any;
    createFileInput: any;
    wickEditorFileSystemType: string;
    openWickLocalFileViewer: any;
    warnBeforeSave: any;
    localStorage: any;
    toWavFunc: any;
    GIF: any;
    [key: string]: any; // Allow any property on window
  }

  // Make all objects more flexible
  interface Object {
    [key: string]: any;
  }

  // Global error function
  var error: any;
}

// Module declarations
declare module '*.scss' {
  const content: any;
  export default content;
}

declare module '*.css' {
  const content: any;
  export default content;
}

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.bmp' {
  const content: string;
  export default content;
}

declare module '*.tiff' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.js' {
  const content: any;
  export = content;
}

declare module 'react-dnd' {
  export const DndProvider: any;
  export const useDrag: any;
  export const useDrop: any;
  export const HTML5Backend: any;
}

declare module 'react-dnd-html5-backend' {
  export const HTML5Backend: any;
}

declare module 'react-reflex' {
  export const ReflexContainer: any;
  export const ReflexElement: any;
  export const ReflexSplitter: any;
}

declare module 'react-sizeme' {
  export const SizeMe: any;
  export const withSize: any;
}

declare module 'react-toastify' {
  export const toast: any;
  export const ToastContainer: any;
}

declare module 'react-color' {
  export const ChromePicker: any;
  export const SwatchesPicker: any;
  export const CirclePicker: any;
  export const CompactPicker: any;
  export const PhotoshopPicker: any;
  export const SketchPicker: any;
  export const HuePicker: any;
  export const AlphaPicker: any;
  export const BlockPicker: any;
  export const GithubPicker: any;
  export const TwitterPicker: any;
}

declare module 'react-modal' {
  const Modal: any;
  export default Modal;
}

declare module 'react-ace' {
  const AceEditor: any;
  export default AceEditor;
}

declare module 'ace-builds' {
  export const ace: any;
}

declare module 'localforage' {
  const localForage: any;
  export default localForage;
}

declare module 'underscore' {
  export const throttle: any;
  export const debounce: any;
  export const _: any;
}

declare module 'classnames' {
  const classNames: any;
  export default classNames;
}

// Make React components more flexible
declare module 'react' {
  interface Component<P = {}, S = {}> {
    props: P & { [key: string]: any };
    state: S & { [key: string]: any };
    [key: string]: any;
  }
  
  interface PureComponent<P = {}, S = {}> {
    props: P & { [key: string]: any };
    state: S & { [key: string]: any };
    [key: string]: any;
  }
}
declare global {
  interface Window {
    // Add any window properties used in the app
    wickEditor?: any;
    electronAPI?: any;
  }
  
  // Common types used throughout the app
  namespace Wick {
    interface Project {
      // Add project type definition
      [key: string]: any;
    }
    
    interface Asset {
      // Add asset type definition
      [key: string]: any;
    }
    
    interface Tool {
      // Add tool type definition
      [key: string]: any;
    }
  }
}

// SVG modules
declare module '*.svg' {
  import React from 'react';
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

// Image modules
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

// CSS modules
declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

export {};
