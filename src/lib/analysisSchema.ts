import type { Analysis } from "./adAnalyzer";
const string = { type: "string" };
const strings = { type: "array", items: string };
const object = (properties: Record<string, unknown>) => ({ type: "object", properties, required: Object.keys(properties), additionalProperties: false });
export const analysisSchema = object({
  signals: strings, strengths: strings, weaknesses: strings, improvements: strings,
  rewrites: { type: "array", minItems: 3, maxItems: 3, items: object({
    key: string, framework: string, whenToUse: string,
    parts: { type: "array", items: object({ label: string, text: string }) }
  }) }
});
export function isAnalysis(value: unknown): value is Analysis {
  if (!value || typeof value !== "object") return false;
  const a = value as Record<string, unknown>;
  const text = (v: unknown) => typeof v === "string" && v.trim().length > 0 && v.length <= 6000;
  return [a.signals, a.strengths, a.weaknesses, a.improvements].every(v => Array.isArray(v) && v.length > 0 && v.length <= 12 && v.every(text)) &&
    Array.isArray(a.rewrites) && a.rewrites.length === 3 && new Set(a.rewrites.map(r => r?.key)).size === 3 && a.rewrites.every(r => r && text(r.key) && text(r.framework) && text(r.whenToUse) && Array.isArray(r.parts) && r.parts.length > 0 && r.parts.length <= 8 && r.parts.every((p: {label?: unknown; text?: unknown}) => p && text(p.label) && text(p.text)));
}
