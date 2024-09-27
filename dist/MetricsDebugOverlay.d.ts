export interface MetricsDebugOverlayProps {
    /**
     * Add MetricsLogger to log metrics to console.
     */
    withLogger?: boolean;
    /**
     * Callback called when pressing close button. If not set, the close button won't be shown
     */
    onClose?: () => void;
}
declare const MetricsDebugOverlay: ({ withLogger, onClose, }: MetricsDebugOverlayProps) => import("react/jsx-runtime").JSX.Element;
export { MetricsDebugOverlay };
