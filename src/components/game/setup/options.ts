import type { SegmentOption } from '../../ui/SegmentedControl';

/** SegmentedControl works with strings; this maps number|null options both ways. */
export function numberOptions<T extends number | null>(values: readonly T[], label: (v: T) => string, hint?: (v: T) => string) {
  const options: SegmentOption<string>[] = values.map((v) => {
    const option: SegmentOption<string> = { value: String(v), label: label(v) };
    const h = hint?.(v);
    if (h) option.hint = h;
    return option;
  });
  const parse = (s: string): T => values.find((v) => String(v) === s) ?? values[0]!;
  return { options, parse };
}
