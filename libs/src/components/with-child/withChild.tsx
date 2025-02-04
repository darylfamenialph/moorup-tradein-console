/* eslint-disable @typescript-eslint/no-explicit-any */
export function withChild(Component: any) {
  return Component as any & { children: any };
}
