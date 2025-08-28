// Global legacy shims to reduce type errors during migration

declare global {
  interface Window {
    Wick: any;
    saveFileFromWick?: any;
    loadWickFileEntry?: any;
    deleteLocalWickFile?: any;
    editor?: any;
    HTMLPreview?: any;
  }
}

// Module augmentation for react to widen component prop defaults and loosen DOM props
declare module 'react' {
  import * as React from 'react';
  // Widen defaults to any to avoid errors on legacy class components without generics
  interface Component<P = any, S = any> { }
  type ComponentClass<P = any> = new (...args: any[]) => Component<P, any>;
  type FunctionComponent<P = any> = (props: P & { children?: any }) => React.ReactElement | null;
  type ComponentType<P = any> = ComponentClass<P> | FunctionComponent<P>;
  interface HTMLAttributes<T> { [key: string]: any; }
  interface DetailedHTMLProps<E, T> { [key: string]: any; }
  interface InputHTMLAttributes<T> { [key: string]: any; }
  interface SVGProps<T> { [key: string]: any; }
}

// Loosen JSX namespace so intrinsic attributes don't error
declare namespace JSX {
  interface IntrinsicAttributes { [key: string]: any; }
  interface IntrinsicClassAttributes<T> { [key: string]: any; }
  interface ElementAttributesProperty { props: any; }
}

// Allow importing common non-ts assets without types
declare module '*.css';
declare module '*.png';
declare module '*.jpg';
declare module '*.svg';

declare module '*.woff';
declare module '*.woff2';

export {}
