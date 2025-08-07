/* tslint:disable */
/* eslint-disable */
export function parse_date(date: string): DateParseResult;
export enum DateParseCode {
  Failed = 0,
  GregInput = 1,
  Sac13Input = 2,
}
export class DateParseResult {
  private constructor();
  free(): void;
  code: DateParseCode;
  format: string;
  tomorrow: string;
  yesterday: string;
  greg_day: number;
  greg_month: number;
  greg_year: number;
  greg_weekday: number;
  sac13_day: number;
  sac13_month: number;
  sac13_year: number;
  sac13_weekday: number;
}

export type InitInput =
  | RequestInfo
  | URL
  | Response
  | BufferSource
  | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_dateparseresult_free: (a: number, b: number) => void;
  readonly __wbg_get_dateparseresult_code: (a: number) => number;
  readonly __wbg_set_dateparseresult_code: (a: number, b: number) => void;
  readonly __wbg_get_dateparseresult_format: (a: number) => [number, number];
  readonly __wbg_set_dateparseresult_format: (
    a: number,
    b: number,
    c: number,
  ) => void;
  readonly __wbg_get_dateparseresult_tomorrow: (a: number) => [number, number];
  readonly __wbg_set_dateparseresult_tomorrow: (
    a: number,
    b: number,
    c: number,
  ) => void;
  readonly __wbg_get_dateparseresult_yesterday: (a: number) => [number, number];
  readonly __wbg_set_dateparseresult_yesterday: (
    a: number,
    b: number,
    c: number,
  ) => void;
  readonly __wbg_get_dateparseresult_greg_day: (a: number) => number;
  readonly __wbg_set_dateparseresult_greg_day: (a: number, b: number) => void;
  readonly __wbg_get_dateparseresult_greg_month: (a: number) => number;
  readonly __wbg_set_dateparseresult_greg_month: (a: number, b: number) => void;
  readonly __wbg_get_dateparseresult_greg_year: (a: number) => number;
  readonly __wbg_set_dateparseresult_greg_year: (a: number, b: number) => void;
  readonly __wbg_get_dateparseresult_greg_weekday: (a: number) => number;
  readonly __wbg_set_dateparseresult_greg_weekday: (
    a: number,
    b: number,
  ) => void;
  readonly __wbg_get_dateparseresult_sac13_day: (a: number) => number;
  readonly __wbg_set_dateparseresult_sac13_day: (a: number, b: number) => void;
  readonly __wbg_get_dateparseresult_sac13_month: (a: number) => number;
  readonly __wbg_set_dateparseresult_sac13_month: (
    a: number,
    b: number,
  ) => void;
  readonly __wbg_get_dateparseresult_sac13_year: (a: number) => number;
  readonly __wbg_set_dateparseresult_sac13_year: (a: number, b: number) => void;
  readonly __wbg_get_dateparseresult_sac13_weekday: (a: number) => number;
  readonly __wbg_set_dateparseresult_sac13_weekday: (
    a: number,
    b: number,
  ) => void;
  readonly parse_date: (a: number, b: number) => number;
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(
  module: { module: SyncInitInput } | SyncInitInput,
): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(
  module_or_path?:
    | { module_or_path: InitInput | Promise<InitInput> }
    | InitInput
    | Promise<InitInput>,
): Promise<InitOutput>;
