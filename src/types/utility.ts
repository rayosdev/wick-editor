/**
 * Utility types for gradual TypeScript adoption
 */

// For temporary any typing that we'll fix later
export type TODO_ANY = any;

// For DOM elements that might be null
export type MaybeElement<T extends Element = Element> = T | null;

// For event handlers
export type EventHandler<T extends Event = Event> = (event: T) => void;

// For React refs
export type MaybeRef<T> = T | null;

// For optional properties that are commonly undefined
export type Optional<T> = T | undefined;

// For window properties that might not exist
export type WindowProperty<T> = T | undefined;

// For paper.js objects that might be null
export type PaperObject = any; // TODO: properly type paper.js objects

// For Wick engine objects
export type WickObject = any; // TODO: properly type Wick objects

// Common event types
export interface MouseEventWithTarget extends MouseEvent {
  target: HTMLElement;
}

export interface ChangeEventWithTarget extends Event {
  target: HTMLInputElement;
}

// For component props that need to be defined later
export type ComponentProps = Record<string, any>;

// For refs to DOM elements
export type ElementRef<T extends HTMLElement = HTMLElement> = React.RefObject<T>;
