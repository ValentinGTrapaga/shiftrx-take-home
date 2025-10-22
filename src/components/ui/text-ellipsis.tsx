"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TextEllipsisProps {
  text: string;
  length: number;
  className?: string;
}

export function TextEllipsis({ text, length, className }: TextEllipsisProps) {
  const shouldTruncate = text.length > length;
  const truncatedText = shouldTruncate ? `${text.slice(0, length)}...` : text;

  if (!shouldTruncate) {
    return <span className={className}>{text}</span>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={className}>{truncatedText}</span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs wrap-break-word text-base">{text}</p>
      </TooltipContent>
    </Tooltip>
  );
}
