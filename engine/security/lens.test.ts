import { describe, expect, it } from 'vitest';
import { evaluateSecurity } from './lens';

describe('security lens', () => {
  it('shows edit-capable workspace roles bypassing semantic-model RLS and OLS', () => {
    const admin = evaluateSecurity('workspace-admin');
    expect(admin.modelSecurityBypassed).toBe(true);
    expect(admin.reportRows).toHaveLength(4);
    expect(admin.hiddenColumns).toEqual([]);
  });

  it('filters Norway sales rows for a Viewer assigned to the Norway model role', () => {
    const norway = evaluateSecurity('norway-sales');
    expect(norway.reportRows.map((row) => row.region)).toEqual(['Norway', 'Norway']);
    expect(norway.totalRevenue).toBe(1145);
    expect(norway.visibleColumns).not.toContain('Margin');
  });

  it('keeps report access separate from direct OneLake data access', () => {
    const viewer = evaluateSecurity('report-viewer');
    expect(viewer.report).toBe(true);
    expect(viewer.oneLakeBlocked).toBe(true);
    expect(viewer.directRows).toEqual([]);
  });

  it('applies a curated OneLake row scope independently', () => {
    const sweden = evaluateSecurity('sweden-sales');
    expect(sweden.directRows).toHaveLength(1);
    expect(sweden.directRows[0].region).toBe('Sweden');
  });
});
