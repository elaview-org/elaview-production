/**
 * Quadtree Rebuild Cron Job Endpoint
 *
 * Scheduled endpoint to rebuild the spatial quadtree from current database state.
 * This should be run periodically (e.g., daily) to keep the quadtree in sync
 * with space additions, updates, and deletions.
 *
 * Authentication: Bearer token via CRON_SECRET environment variable
 *
 * @route POST /api/cron/rebuild-quadtree
 */

import { type NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../elaview-mvp/src/server/db';
import { quadtreeService } from '../../../../../elaview-mvp/src/server/services/quadtree.service';

/**
 * POST handler for quadtree rebuild
 *
 * @param request - Next.js request object
 * @returns JSON response with build results
 *
 * @example
 * ```bash
 * curl -X POST https://your-domain.com/api/cron/rebuild-quadtree \
 *   -H "Authorization: Bearer your_cron_secret"
 * ```
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

    if (!process.env.CRON_SECRET) {
      console.error('[Rebuild Quadtree] CRON_SECRET not configured');
      return NextResponse.json(
        {
          success: false,
          error: 'Server configuration error',
          message: 'CRON_SECRET environment variable not set',
        },
        { status: 500 }
      );
    }

    if (authHeader !== expectedAuth) {
      console.warn('[Rebuild Quadtree] Unauthorized request attempt');
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Invalid or missing authorization token',
        },
        { status: 401 }
      );
    }

    console.log('[Rebuild Quadtree] Starting quadtree rebuild...');

    // Clear existing tree from memory
    quadtreeService.clearTree();

    // Build new tree from database
    const result = await quadtreeService.buildFromDatabase(db);

    const totalDuration = Date.now() - startTime;

    console.log('[Rebuild Quadtree] Rebuild completed successfully');
    console.log(`[Rebuild Quadtree] Total duration: ${totalDuration}ms`);
    console.log(`[Rebuild Quadtree] Nodes created: ${result.totalNodes}`);
    console.log(`[Rebuild Quadtree] Spaces indexed: ${result.totalSpaces}`);

    return NextResponse.json(
      {
        success: true,
        duration: totalDuration,
        nodesCreated: result.totalNodes,
        spacesIndexed: result.totalSpaces,
        message: `Quadtree rebuilt successfully: ${result.totalNodes} nodes, ${result.totalSpaces} spaces indexed in ${totalDuration}ms`,
      },
      { status: 200 }
    );
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    console.error('[Rebuild Quadtree] Rebuild failed:', errorMessage);
    console.error('[Rebuild Quadtree] Error details:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Rebuild failed',
        message: errorMessage,
        duration: totalDuration,
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler - returns information about the endpoint
 *
 * @returns JSON response with endpoint documentation
 */
export async function GET() {
  return NextResponse.json(
    {
      endpoint: '/api/cron/rebuild-quadtree',
      method: 'POST',
      description: 'Rebuilds the spatial quadtree from current database state',
      authentication: 'Bearer token (CRON_SECRET)',
      schedule: 'Recommended: Daily',
      usage: {
        curl: 'curl -X POST https://your-domain.com/api/cron/rebuild-quadtree -H "Authorization: Bearer YOUR_SECRET"',
      },
      status: 'Available',
    },
    { status: 200 }
  );
}
