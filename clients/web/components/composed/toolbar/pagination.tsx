"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/primitives/pagination";
import { useSearchParamsUpdater } from "@/hooks/use-search-params-updater";

type Props = {
  pageInfo?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
  pageSize?: number;
};

export default function ToolbarPagination({ pageInfo, pageSize = 32 }: Props) {
  const { update } = useSearchParamsUpdater();

  if (!pageInfo) return <div className="flex-1" />;

  return (
    <div className="flex-1">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={!pageInfo.hasPreviousPage}
              className={
                !pageInfo.hasPreviousPage
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
              onClick={(e) => {
                e.preventDefault();
                if (!pageInfo.hasPreviousPage) return;
                update({
                  before: pageInfo.startCursor,
                  after: null,
                  first: null,
                  last: String(pageSize),
                });
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={!pageInfo.hasNextPage}
              className={
                !pageInfo.hasNextPage
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
              onClick={(e) => {
                e.preventDefault();
                if (!pageInfo.hasNextPage) return;
                update({
                  after: pageInfo.endCursor,
                  before: null,
                  last: null,
                  first: String(pageSize),
                });
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
