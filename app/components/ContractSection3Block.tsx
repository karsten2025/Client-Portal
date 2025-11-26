// app/components/ContractSection3Block.tsx
"use client";

import {
  buildContractSection3,
  type ContractSection3Input,
} from "../lib/contractSection3";
import type { Lang } from "../lib/catalog";

type Props = {
  lang: Lang;
  input: ContractSection3Input;
  className?: string;
};

export function ContractSection3Block({ lang, input, className }: Props) {
  const text = buildContractSection3(lang, input);

  return (
    <pre
      className={
        className ??
        "whitespace-pre-wrap text-xs sm:text-sm leading-relaxed text-slate-900"
      }
    >
      {text}
    </pre>
  );
}
