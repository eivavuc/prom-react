import { PropsWithChildren } from 'react';
import { MetricDefinition } from './createMetrics';
export interface MetricsProviderProps {
    /**
     * Name of the app. All metrics will include a label 'app_name' with this value.
     */
    appName: string;
    /**
     * Owner of the app. All metrics will include a label 'owner' with this value.
     */
    owner?: string;
    /**
     * Url of the push gateway aggregator. If not set, metrics will be collected but not sent.
     */
    metricsAggregatorUrl?: string;
    /**
     * Extra fetch options (headers, credentials, etc) to be used when sending metrics to the aggregator.
     */
    fetchOptions?: Partial<RequestInit>;
    /**
     * Given that all route change metrics include a 'path' label, you should add this function to avoid cardinality issues if you
     * have parameterized routes (ex: `/products/:id`).
     * @param path The actual path of the route (ex: `/products/123`)
     * @returns The normalized path of the route (ex: `/products/:id`)
     *
     * @example
     * ```ts
     * const normalizePath = (path: string) => {
     *  const match = path.match(/\/products\/(\d+)/);
     *  if (match) {
     *  return `/products/:id`;
     *  }
     *  return path;
     * }
     * ```
     */
    getNormalizedPath?: (path: string) => string;
    /**
     * Bucket list for the histogram metrics. Defaulted to [0.001, 0.01, 0.1, 1, 2, 5, 10]
     */
    histogramBuckets?: number[];
    /**
     * Custom application metrics. Please define in a const outside the component to avoid infinite loops trying to create them.
     * @example
     * ```tsx
     * const customMetrics: MetricDefinition[] = [
     * {
     *   type: 'counter',
     *   name: 'test_metric',
     *   description: 'Test metric',
     *  },
     * ];
     *
     * const MyApp = () => {
     *  return <MetricsProvider appName="MyApp" customMetrics={customMetrics}>...</MetricsProvider>
     * }
     * ```
     */
    customMetrics?: MetricDefinition[];
}
declare const MetricsProvider: ({ appName, children, metricsAggregatorUrl, getNormalizedPath, owner, histogramBuckets, customMetrics, fetchOptions, }: PropsWithChildren<MetricsProviderProps>) => import("react/jsx-runtime").JSX.Element;
export { MetricsProvider };
declare global {
    interface Window {
        __PROM_REACT_LOAD_FAILURE_TIMEOUT__?: number;
    }
}
