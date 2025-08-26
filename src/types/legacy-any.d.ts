// Transitional file: TODO_ANY alias for gradual typing
// We'll replace usages with real types later.

declare global {
  // Provide a global alias so existing imports can still work if they refer to TODO_ANY
  type TODO_ANY = any;
}

export {};
