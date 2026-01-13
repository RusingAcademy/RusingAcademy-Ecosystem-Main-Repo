/**
 * Multi-Tenant Utilities
 * 
 * Provides guards and helpers for multi-tenant resource access control.
 * Supports three product areas: RusingAcademy, Lingueefy, Barholex Media
 */

export type ProductArea = 'rusingacademy' | 'lingueefy' | 'barholex' | 'all';

/**
 * Check if a user has access to a specific product area
 */
export function hasProductAreaAccess(
  userProductArea: ProductArea | null | undefined,
  requiredProductArea: ProductArea
): boolean {
  // If user has 'all' access, they can access everything
  if (userProductArea === 'all') {
    return true;
  }
  
  // If required area is 'all', only users with 'all' can access
  if (requiredProductArea === 'all') {
    return userProductArea === 'all';
  }
  
  // Direct match
  return userProductArea === requiredProductArea;
}

/**
 * Get product area from request path
 * Used to determine which product area a request is targeting
 */
export function getProductAreaFromPath(path: string): ProductArea {
  const normalizedPath = path.toLowerCase();
  
  if (normalizedPath.includes('/lingueefy')) {
    return 'lingueefy';
  }
  
  if (normalizedPath.includes('/barholex')) {
    return 'barholex';
  }
  
  // Default to RusingAcademy for main paths
  return 'rusingacademy';
}

/**
 * Get product area from hostname/subdomain
 * Useful for subdomain-based multi-tenancy
 */
export function getProductAreaFromHost(host: string): ProductArea {
  const normalizedHost = host.toLowerCase();
  
  if (normalizedHost.includes('lingueefy')) {
    return 'lingueefy';
  }
  
  if (normalizedHost.includes('barholex')) {
    return 'barholex';
  }
  
  return 'rusingacademy';
}

/**
 * Filter resources by product area
 * Generic function to filter any array of resources with productArea field
 */
export function filterByProductArea<T extends { productArea?: ProductArea | null }>(
  resources: T[],
  userProductArea: ProductArea | null | undefined
): T[] {
  if (!userProductArea) {
    return [];
  }
  
  if (userProductArea === 'all') {
    return resources;
  }
  
  return resources.filter(
    (r) => r.productArea === userProductArea || r.productArea === 'all'
  );
}

/**
 * Validate that a resource belongs to the user's product area
 * Throws an error if access is denied
 */
export function assertProductAreaAccess(
  userProductArea: ProductArea | null | undefined,
  resourceProductArea: ProductArea | null | undefined,
  resourceType: string = 'resource'
): void {
  if (!userProductArea) {
    throw new Error(`Access denied: User has no product area assigned`);
  }
  
  if (!resourceProductArea) {
    // Resource has no product area restriction
    return;
  }
  
  if (!hasProductAreaAccess(userProductArea, resourceProductArea)) {
    throw new Error(
      `Access denied: User (${userProductArea}) cannot access ${resourceType} (${resourceProductArea})`
    );
  }
}

/**
 * Get display name for product area
 */
export function getProductAreaDisplayName(productArea: ProductArea): string {
  const names: Record<ProductArea, string> = {
    rusingacademy: 'RusingAcademy',
    lingueefy: 'Lingueefy',
    barholex: 'Barholex Media',
    all: 'All Products',
  };
  return names[productArea] || productArea;
}

/**
 * Get all product areas (excluding 'all')
 */
export function getAllProductAreas(): Exclude<ProductArea, 'all'>[] {
  return ['rusingacademy', 'lingueefy', 'barholex'];
}
