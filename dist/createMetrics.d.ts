import { Registry } from 'promjs/registry';
export declare enum GoldenMetrics {
    AppLoaded = "prom_react_app_loaded",
    AppUnloaded = "prom_react_app_unloaded",
    PageNavigation = "prom_react_navigation_duration_seconds",
    PageTimeToComplete = "prom_react_ttc_seconds",
    PageTimeToUsable = "prom_react_ttu_seconds",
    PerformanceTime = "prom_react_performance_seconds"
}
export type MetricDefinition = {
    type: 'counter';
    name: string;
    description: string;
} | {
    type: 'histogram';
    name: string;
    description: string;
    buckets?: number[];
};
export declare const createMetrics: (registry: Registry, defaultBuckets: number[], customMetrics?: MetricDefinition[]) => void;
