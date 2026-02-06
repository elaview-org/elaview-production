"use client";
"use no memo";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { IconDotsVertical } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import { Checkbox } from "@/components/primitives/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/primitives/dropdown-menu";
import { Skeleton } from "@/components/primitives/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/primitives/table";
import { cn } from "@/lib/utils";

type SkeletonType =
  | "select"
  | "text"
  | "imageText"
  | "stack"
  | "date"
  | "currency"
  | "number"
  | "badge"
  | "actions";

type ColumnMeta = {
  skeleton?: SkeletonType;
  skeletonWidth?: string;
  headerAlign?: "left" | "right";
};

type TableViewProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  getRowId: (row: TData) => string;
  emptyMessage?: string;
  enableSelection?: boolean;
  pageSize?: number;
  onSelectionChange?: (selectedIds: string[]) => void;
};

export default function TableView<TData>({
  data,
  columns,
  getRowId,
  emptyMessage = "No results.",
  enableSelection = true,
  pageSize: initialPageSize = 10,
  onSelectionChange,
}: TableViewProps<TData>) {
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const onSelectionChangeRef = React.useRef(onSelectionChange);
  onSelectionChangeRef.current = onSelectionChange;

  const handleRowSelectionChange = React.useCallback(
    (updater: React.SetStateAction<Record<string, boolean>>) => {
      setRowSelection((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        queueMicrotask(() => {
          if (onSelectionChangeRef.current) {
            const ids = Object.keys(next).filter((key) => next[key]);
            onSelectionChangeRef.current(ids);
          }
        });
        return next;
      });
    },
    []
  );

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table is incompatible with React Compiler; "use no memo" directive applied
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId,
    enableRowSelection: enableSelection,
    onRowSelectionChange: handleRowSelectionChange,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="bg-muted sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="**:data-[slot=table-cell]:first:w-8">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function SkeletonCell({ type }: { type: SkeletonType }) {
  switch (type) {
    case "select":
      return <Skeleton className="size-4" />;
    case "text":
      return <Skeleton className="h-4 w-32" />;
    case "imageText":
      return (
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded" />
          <Skeleton className="h-4 w-32" />
        </div>
      );
    case "stack":
      return (
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      );
    case "date":
      return <Skeleton className="h-4 w-24" />;
    case "currency":
      return <Skeleton className="ml-auto h-4 w-16" />;
    case "number":
      return <Skeleton className="ml-auto h-4 w-8" />;
    case "badge":
      return <Skeleton className="h-5 w-20 rounded-full" />;
    case "actions":
      return <Skeleton className="size-8" />;
    default:
      return <Skeleton className="h-4 w-24" />;
  }
}

type TableViewSkeletonProps<TData> = {
  columns: ColumnDef<TData>[];
  rows?: number;
};

export function TableViewSkeleton<TData>({
  columns,
  rows = 5,
}: TableViewSkeletonProps<TData>) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            {columns.map((col, i) => {
              const meta = col.meta as ColumnMeta | undefined;
              const align = meta?.headerAlign;
              return (
                <TableHead
                  key={col.id ?? i}
                  className={cn(
                    meta?.skeleton === "select" && "w-8",
                    meta?.skeleton === "actions" && "w-8",
                    align === "right" && "text-right"
                  )}
                >
                  {typeof col.header === "string" ? col.header : ""}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((col, colIndex) => {
                const meta = col.meta as ColumnMeta | undefined;
                const skeletonType = meta?.skeleton ?? "text";
                return (
                  <TableCell key={col.id ?? colIndex}>
                    <SkeletonCell type={skeletonType} />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function createSelectColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    meta: { skeleton: "select" } as ColumnMeta,
    enableSorting: false,
    enableHiding: false,
  };
}

type Accessor<TData, TValue> = keyof TData | ((row: TData) => TValue);

function getValue<TData, TValue>(
  row: TData,
  accessor: Accessor<TData, TValue>
): TValue {
  if (typeof accessor === "function") {
    return accessor(row);
  }
  return row[accessor] as TValue;
}

type TextColumnOptions<TData> = {
  key: string;
  header: string;
  value: Accessor<TData, string | null | undefined>;
  href?: (row: TData) => string;
  truncate?: boolean;
  muted?: boolean;
  enableHiding?: boolean;
};

export function textColumn<TData>({
  key,
  header,
  value,
  href,
  truncate = true,
  muted = false,
  enableHiding = true,
}: TextColumnOptions<TData>): ColumnDef<TData> {
  return {
    id: key,
    header,
    cell: ({ row }) => {
      const text = getValue(row.original, value) ?? "—";
      const content = (
        <span
          className={cn(
            truncate && "truncate",
            muted ? "text-muted-foreground" : "font-medium"
          )}
        >
          {text}
        </span>
      );
      if (href) {
        return (
          <Link href={href(row.original)} className="hover:underline">
            {content}
          </Link>
        );
      }
      return content;
    },
    meta: { skeleton: "text" } as ColumnMeta,
    enableHiding,
  };
}

type ImageTextColumnOptions<TData> = {
  key: string;
  header: string;
  image: Accessor<TData, string | null | undefined>;
  text: Accessor<TData, string | null | undefined>;
  href?: (row: TData) => string;
  imageSize?: number;
  enableHiding?: boolean;
};

export function imageTextColumn<TData>({
  key,
  header,
  image,
  text,
  href,
  imageSize = 40,
  enableHiding = false,
}: ImageTextColumnOptions<TData>): ColumnDef<TData> {
  return {
    id: key,
    header,
    cell: ({ row }) => {
      const imageUrl = getValue(row.original, image);
      const textValue = getValue(row.original, text) ?? "Unknown";

      const content = (
        <div className="flex items-center gap-3">
          <div
            className="bg-muted relative shrink-0 overflow-hidden rounded"
            style={{ width: imageSize, height: imageSize }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={textValue}
                fill
                className="object-cover"
                sizes={`${imageSize}px`}
              />
            ) : (
              <div className="bg-muted size-full" />
            )}
          </div>
          <span className="truncate font-medium">{textValue}</span>
        </div>
      );

      if (href) {
        return (
          <Link
            href={href(row.original)}
            className="flex items-center gap-3 hover:underline"
          >
            {content}
          </Link>
        );
      }
      return content;
    },
    meta: { skeleton: "imageText" } as ColumnMeta,
    enableHiding,
  };
}

type StackColumnOptions<TData> = {
  key: string;
  header: string;
  primary: Accessor<TData, string | null | undefined>;
  secondary: Accessor<TData, string | null | undefined>;
  enableHiding?: boolean;
};

export function stackColumn<TData>({
  key,
  header,
  primary,
  secondary,
  enableHiding = true,
}: StackColumnOptions<TData>): ColumnDef<TData> {
  return {
    id: key,
    header,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="truncate">
          {getValue(row.original, primary) ?? "Unknown"}
        </span>
        <span className="text-muted-foreground truncate text-xs">
          {getValue(row.original, secondary) ?? ""}
        </span>
      </div>
    ),
    meta: { skeleton: "stack" } as ColumnMeta,
    enableHiding,
  };
}

type DateFormat = "short" | "medium" | "long";

const DATE_FORMATS: Record<DateFormat, Intl.DateTimeFormatOptions> = {
  short: { month: "short", day: "numeric" },
  medium: { month: "short", day: "numeric", year: "numeric" },
  long: { month: "long", day: "numeric", year: "numeric" },
};

type DateColumnOptions<TData> = {
  key: string;
  header: string;
  value: Accessor<TData, string | Date | null | undefined>;
  format?: DateFormat;
  enableHiding?: boolean;
};

export function dateColumn<TData>({
  key,
  header,
  value,
  format = "short",
  enableHiding = true,
}: DateColumnOptions<TData>): ColumnDef<TData> {
  return {
    id: key,
    header,
    cell: ({ row }) => {
      const dateValue = getValue(row.original, value);
      if (!dateValue) {
        return <span className="text-muted-foreground">—</span>;
      }
      const formatted = new Date(dateValue).toLocaleDateString(
        "en-US",
        DATE_FORMATS[format]
      );
      return (
        <span className="text-muted-foreground text-sm whitespace-nowrap">
          {formatted}
        </span>
      );
    },
    meta: { skeleton: "date" } as ColumnMeta,
    enableHiding,
  };
}

type DateRangeColumnOptions<TData> = {
  key: string;
  header: string;
  start: Accessor<TData, string | Date | null | undefined>;
  end: Accessor<TData, string | Date | null | undefined>;
  format?: DateFormat;
  enableHiding?: boolean;
};

export function dateRangeColumn<TData>({
  key,
  header,
  start,
  end,
  format = "short",
  enableHiding = true,
}: DateRangeColumnOptions<TData>): ColumnDef<TData> {
  return {
    id: key,
    header,
    cell: ({ row }) => {
      const startValue = getValue(row.original, start);
      const endValue = getValue(row.original, end);
      if (!startValue || !endValue) {
        return <span className="text-muted-foreground">—</span>;
      }
      const formatOptions = DATE_FORMATS[format];
      const startFormatted = new Date(startValue).toLocaleDateString(
        "en-US",
        formatOptions
      );
      const endFormatted = new Date(endValue).toLocaleDateString(
        "en-US",
        formatOptions
      );
      return (
        <span className="text-muted-foreground text-sm whitespace-nowrap">
          {startFormatted} – {endFormatted}
        </span>
      );
    },
    meta: { skeleton: "date" } as ColumnMeta,
    enableHiding,
  };
}

type CurrencyColumnOptions<TData> = {
  key: string;
  header: string;
  value: Accessor<TData, string | number | null | undefined>;
  currency?: string;
  enableHiding?: boolean;
};

export function currencyColumn<TData>({
  key,
  header,
  value,
  currency = "USD",
  enableHiding = true,
}: CurrencyColumnOptions<TData>): ColumnDef<TData> {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  });

  return {
    id: key,
    header: () => <div className="text-right">{header}</div>,
    cell: ({ row }) => {
      const amount = getValue(row.original, value);
      if (amount == null) {
        return <div className="text-muted-foreground text-right">—</div>;
      }
      return (
        <div className="text-right font-medium tabular-nums">
          {formatter.format(Number(amount))}
        </div>
      );
    },
    meta: { skeleton: "currency", headerAlign: "right" } as ColumnMeta,
    enableHiding,
  };
}

type NumberColumnOptions<TData> = {
  key: string;
  header: string;
  value: Accessor<TData, number | null | undefined>;
  align?: "left" | "right";
  enableHiding?: boolean;
};

export function numberColumn<TData>({
  key,
  header,
  value,
  align = "right",
  enableHiding = true,
}: NumberColumnOptions<TData>): ColumnDef<TData> {
  const isRight = align === "right";
  return {
    id: key,
    header: () =>
      isRight ? <div className="text-right">{header}</div> : header,
    cell: ({ row }) => {
      const num = getValue(row.original, value);
      if (num == null) {
        return (
          <div className={cn("text-muted-foreground", isRight && "text-right")}>
            —
          </div>
        );
      }
      return (
        <div className={cn("tabular-nums", isRight && "text-right")}>{num}</div>
      );
    },
    meta: {
      skeleton: "number",
      headerAlign: isRight ? "right" : "left",
    } as ColumnMeta,
    enableHiding,
  };
}

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

type BadgeColumnOptions<TData, TStatus extends string> = {
  key: string;
  header: string;
  value: Accessor<TData, TStatus>;
  labels: Record<TStatus, string>;
  icon?: (status: TStatus) => React.ReactNode;
  variant?: (status: TStatus) => BadgeVariant;
  enableHiding?: boolean;
};

export function badgeColumn<TData, TStatus extends string>({
  key,
  header,
  value,
  labels,
  icon,
  variant,
  enableHiding = true,
}: BadgeColumnOptions<TData, TStatus>): ColumnDef<TData> {
  return {
    id: key,
    header,
    cell: ({ row }) => {
      const status = getValue(row.original, value);
      const badgeVariant = variant?.(status) ?? "outline";
      const iconElement = icon?.(status);

      return (
        <Badge
          variant={badgeVariant}
          className={cn("gap-1", iconElement && "px-1.5")}
        >
          {iconElement}
          {labels[status] ?? status}
        </Badge>
      );
    },
    meta: { skeleton: "badge" } as ColumnMeta,
    enableHiding,
  };
}

type ActionItem<TData> =
  | {
      label: string;
      href?: (row: TData) => string;
      onClick?: (row: TData) => void;
      icon?: React.ReactNode;
      variant?: "default" | "destructive";
      separator?: false;
    }
  | {
      separator: true;
    };

type ActionsColumnOptions<TData> = {
  items: (row: TData) => ActionItem<TData>[];
};

export function actionsColumn<TData>({
  items,
}: ActionsColumnOptions<TData>): ColumnDef<TData> {
  return {
    id: "actions",
    cell: ({ row }) => {
      const menuItems = items(row.original);
      if (menuItems.length === 0) return null;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {menuItems.map((item, index) => {
              if ("separator" in item && item.separator) {
                return <DropdownMenuSeparator key={index} />;
              }

              const menuItem = item as Exclude<
                ActionItem<TData>,
                { separator: true }
              >;

              if (menuItem.href) {
                return (
                  <DropdownMenuItem key={index} asChild>
                    <Link href={menuItem.href(row.original)}>
                      {menuItem.icon}
                      {menuItem.label}
                    </Link>
                  </DropdownMenuItem>
                );
              }

              return (
                <DropdownMenuItem
                  key={index}
                  onClick={() => menuItem.onClick?.(row.original)}
                  variant={menuItem.variant}
                >
                  {menuItem.icon}
                  {menuItem.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    meta: { skeleton: "actions" } as ColumnMeta,
    enableSorting: false,
    enableHiding: false,
  };
}
