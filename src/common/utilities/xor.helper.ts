export function xor(...args: Array<boolean>): boolean {
  return args.reduce((a, b) => a !== b);
}
