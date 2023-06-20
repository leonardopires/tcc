/**
 * This type defines a TypeScript constructor delegate so you can
 * pass a class as a reference.
 */
export type Newable<T> = { new(...args: any[]): T; };