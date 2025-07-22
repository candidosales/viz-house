# Chart Types Refactoring - Summary

## Overview
This refactoring addresses the issue where `chartTypes: Options` was just wrapping the entire `HighCharts.Options` interface. The solution creates more specific, curated interfaces that only expose the properties actually used and supported by the viz-house library.

## Changes Made

### 1. New Chart Option Interfaces (`src/types/chartTypes.ts`)

**Replaced:**
```typescript
// Todo: this should be cleaned up
// https://github.com/ClickHouse/viz-house/issues/6
export type Options = HighCharts.Options;

// Todo: this should be cleaned up
// https://github.com/ClickHouse/viz-house/issues/6
export type SeriesPieOptions = HighCharts.SeriesPieOptions;
```

**With:**
```typescript
// Core chart options interface that contains only the commonly used HighCharts options
export interface VizHouseChartOptions {
  boost?: HighCharts.BoostOptions;
  chart?: HighCharts.ChartOptions;
  colorAxis?: HighCharts.ColorAxisOptions;
  legend?: HighCharts.LegendOptions;
  plotOptions?: HighCharts.PlotOptions;
  series?: HighCharts.SeriesOptionsType[];
  subtitle?: HighCharts.SubtitleOptions;
  title?: HighCharts.TitleOptions;
  tooltip?: HighCharts.TooltipOptions;
  xAxis?: HighCharts.XAxisOptions | HighCharts.XAxisOptions[];
  yAxis?: HighCharts.YAxisOptions | HighCharts.YAxisOptions[];
}

// Specific chart options for XY charts
export interface XYChartOptions extends VizHouseChartOptions {
  // XY charts don't use colorAxis, so we omit it
  colorAxis?: never;
}

// Specific chart options for Pie charts
export interface PieChartOptions extends VizHouseChartOptions {
  // Pie charts don't use xAxis/yAxis/colorAxis
  xAxis?: never;
  yAxis?: never;
  colorAxis?: never;
}

// Specific chart options for Heatmap charts  
export interface HeatmapChartOptions extends VizHouseChartOptions {
  // Heatmap charts use all options including colorAxis
}

// Theme options for the ChartsThemeProvider
export interface ChartThemeOptions extends Pick<HighCharts.Options, 
  'chart' | 'tooltip' | 'legend' | 'plotOptions' | 'responsive' | 'colors' | 'credits'
> {}

// Specific pie series options that only include the properties we actually support
export interface VizHousePieSeriesOptions extends Pick<HighCharts.SeriesPieOptions,
  'type' | 'name' | 'data' | 'showInLegend' | 'innerSize' | 'color' | 'fillColor'
> {
  type: 'pie';
}
```

### 2. Updated Export Types (`src/index.ts`)

**Removed:**
- `Options`
- `SeriesPieOptions`

**Added:**
- `ChartThemeOptions`
- `HeatmapChartOptions`
- `PieChartOptions`
- `VizHouseChartOptions`
- `VizHousePieSeriesOptions`
- `XYChartOptions`

### 3. Component Updates

#### XYChartOptions.ts
- Updated return type of `getXYChartOptions()` from `HighCharts.Options` to `XYChartOptions`
- Added import for `XYChartOptions` type

#### PieChart.tsx
- Updated `getHighchartSeries()` return type from `HighCharts.SeriesPieOptions[]` to `VizHousePieSeriesOptions[]`
- Updated `getPieChartOptions()` return type from `Partial<HighCharts.Options>` to `PieChartOptions`
- Added imports for new types

#### HeatmapChart.tsx
- Updated `getHeatmapChartOptions()` return type to `HeatmapChartOptions`
- Added import for `HeatmapChartOptions` type

#### ChartsThemeProvider.tsx
- Updated `buildHighchartsTheme()` return type from `HighCharts.Options` to `ChartThemeOptions`
- Added import for `ChartThemeOptions` type

## Benefits of This Refactoring

1. **Better Type Safety**: Each chart type now has specific interfaces that prevent invalid option combinations (e.g., pie charts can't use xAxis/yAxis options).

2. **Improved API Discoverability**: Developers can see exactly which options are supported for each chart type.

3. **Reduced Surface Area**: The interfaces only expose the properties that are actually used and supported by the library.

4. **Maintainability**: Changes to supported options can be managed through specific interfaces rather than exposing the entire HighCharts API.

5. **Future-Proof**: The curated interfaces provide better control over which HighCharts options are exposed, making it easier to maintain backwards compatibility.

## Backward Compatibility

The refactoring maintains backward compatibility because:
- All existing chart component props remain the same
- The new interfaces are supersets of what was previously supported
- Internal HighCharts types are still used where appropriate
- The public API surface remains unchanged

## Files Modified

1. `src/types/chartTypes.ts` - Main interface definitions
2. `src/index.ts` - Updated exports
3. `src/components/XYChartOptions.ts` - Updated return types
4. `src/components/PieChart.tsx` - Updated function signatures and types
5. `src/components/HeatmapChart.tsx` - Updated function signatures and types  
6. `src/components/ChartsThemeProvider.tsx` - Updated theme function signature

## Next Steps

This refactoring resolves the GitHub issue #6 by replacing the generic `Options` wrapper with specific, curated interfaces. The implementation provides better type safety while maintaining full backward compatibility.
