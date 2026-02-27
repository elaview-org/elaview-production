import { z } from "zod";
import { SortEnumType } from "@/types/gql";
import { ViewOptions } from "@/types/constants";

export const spaceListParamsSchema = z.object({
  first: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .optional()
    .catch(undefined),
  last: z.coerce.number().int().positive().max(100).optional().catch(undefined),
  after: z.string().optional().catch(undefined),
  before: z.string().optional().catch(undefined),
  sort: z.string().optional().catch(undefined),
  filter: z.string().optional().catch(undefined),
  q: z.string().optional().catch(undefined),
});

const MAP_KEYS = new Set(["minLat", "maxLat", "minLng", "maxLng", "zoom"]);

export function parseSpaceListParams(
  searchParams: unknown,
  view: ViewOptions | undefined,
  extraExcludeKeys: string[] = []
) {
  const params = spaceListParamsSchema.parse(searchParams);

  const allEntries = params.filter
    ? Object.fromEntries(
        params.filter.split(",").map((entry) => {
          const [key, ...rest] = entry.split(":");
          return [key, rest.join(":")];
        })
      )
    : {};

  const excludeKeys = new Set([...MAP_KEYS, ...extraExcludeKeys]);

  const filterEntries = Object.fromEntries(
    Object.entries(allEntries)
      .filter(([key]) => !excludeKeys.has(key))
      .map(([key, value]) => [key, { eq: value }])
  );

  const mapEntries = {
    minLat: allEntries.minLat ? Number(allEntries.minLat) : undefined,
    maxLat: allEntries.maxLat ? Number(allEntries.maxLat) : undefined,
    minLng: allEntries.minLng ? Number(allEntries.minLng) : undefined,
    maxLng: allEntries.maxLng ? Number(allEntries.maxLng) : undefined,
  };

  const zoom = allEntries.zoom ? Number(allEntries.zoom) : undefined;

  const hasBounds =
    mapEntries.minLat !== undefined &&
    mapEntries.maxLat !== undefined &&
    mapEntries.minLng !== undefined &&
    mapEntries.maxLng !== undefined;

  const boundsFilter =
    view === ViewOptions.Map && hasBounds
      ? {
          latitude: { gte: mapEntries.minLat, lte: mapEntries.maxLat },
          longitude: { gte: mapEntries.minLng, lte: mapEntries.maxLng },
        }
      : {};

  const bounds = hasBounds
    ? {
        minLat: mapEntries.minLat!,
        maxLat: mapEntries.maxLat!,
        minLng: mapEntries.minLng!,
        maxLng: mapEntries.maxLng!,
      }
    : undefined;

  const order = params.sort?.split(",").map((entry) => {
    const [key, dir] = entry.split(":");
    return { [key]: dir === "DESC" ? SortEnumType.Desc : SortEnumType.Asc };
  });

  const first = params.last || params.before ? undefined : (params.first ?? 32);

  return {
    params,
    allEntries,
    filterEntries,
    hasBounds,
    boundsFilter,
    bounds,
    zoom,
    order,
    first,
  };
}
