import { Registry } from 'promjs/registry';
export declare const sendMetricsToGateway: (registry: Registry, promGatewayUrl: string, fetchOptions?: Partial<RequestInit>, isAppUnloading?: boolean) => Promise<void>;
export declare const addToMetrics: ({ registry, metricName, value, tags, }: {
    metricName: string;
    registry: Registry;
    tags: Record<string, string>;
    value?: number;
}) => void;
