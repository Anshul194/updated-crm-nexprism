import { useEffect, useRef, useState } from "react";
import api from "@/lib/api-client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";

export const HeatmapViewer = () => {
    const [pages, setPages] = useState<any[]>([]);
    const [selectedUrl, setSelectedUrl] = useState<string>("");
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [clicks, setClicks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        setLoading(true);
        api.get('/tracking/heatmap')
            .then(res => {
                console.log('Heatmap pages response:', res.data);
                if (res.data.pages) {
                    setPages(res.data.pages);
                    if (res.data.pages.length > 0) {
                        const firstPage = res.data.pages[0]._id;
                        setSelectedUrl(firstPage);
                        setPreviewUrl(firstPage);
                    }
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Heatmap error:', err);
                setError(err.message || 'Failed to load heatmap data');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (selectedUrl) {
            api.get(`/tracking/heatmap?url=${encodeURIComponent(selectedUrl)}`)
                .then(res => {
                    console.log('Heatmap clicks response:', res.data);
                    if (res.data.clicks) {
                        setClicks(res.data.clicks);
                    }
                })
                .catch(err => {
                    console.error('Heatmap clicks error:', err);
                });
        }
    }, [selectedUrl]);

    useEffect(() => {
        if (!canvasRef.current || clicks.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Heatmap Logic - Draw circles with gradient
        clicks.forEach(click => {
            const x = (click.x / click.viewport_width) * canvas.width;
            const y = (click.y / click.viewport_height) * canvas.height;

            // Create radial gradient for better heatmap effect
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
            gradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)');
            gradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.2)');
            gradient.addColorStop(1, 'rgba(255, 200, 0, 0.05)');

            ctx.fillStyle = gradient;
            ctx.fillRect(x - 20, y - 20, 40, 40);

            // Draw a small dot at the exact click point
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
            ctx.fill();
        });

    }, [clicks]);

    const handleUrlChange = (url: string) => {
        setSelectedUrl(url);
        setPreviewUrl(url);
    };

    if (loading) {
        return (
            <div className="w-full h-[400px] flex items-center justify-center">
                <p className="text-gray-500">Loading heatmap data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-[400px] flex items-center justify-center">
                <p className="text-red-600">Error: {error}</p>
            </div>
        );
    }

    if (pages.length === 0) {
        return (
            <div className="w-full h-[400px] flex items-center justify-center">
                <p className="text-gray-500">No pages tracked yet. Click data will appear here once users interact with your website.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Select value={selectedUrl} onValueChange={handleUrlChange}>
                    <SelectTrigger className="w-[300px]">
                        <SelectValue placeholder="Select Page" />
                    </SelectTrigger>
                    <SelectContent>
                        {pages.map((p: any) => (
                            <SelectItem key={p._id} value={p._id}>
                                {p._id} ({p.count} sessions)
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="flex-1 flex items-center gap-2">
                    <Input
                        value={previewUrl}
                        onChange={(e) => setPreviewUrl(e.target.value)}
                        placeholder="Enter URL to preview"
                        className="flex-1"
                    />
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                            if (iframeRef.current) {
                                iframeRef.current.src = previewUrl;
                            }
                        }}
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="relative border rounded-lg shadow-lg bg-white overflow-hidden" style={{ width: '100%', height: '600px' }}>
                {/* Website Preview in iframe */}
                <iframe
                    ref={iframeRef}
                    src={previewUrl}
                    className="absolute inset-0 w-full h-full"
                    title="Website Preview"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    onError={() => {
                        console.error('Failed to load iframe');
                    }}
                />

                {/* Heatmap overlay canvas */}
                <canvas
                    ref={canvasRef}
                    width={1000}
                    height={600}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ mixBlendMode: 'multiply' }}
                />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
                <p>
                    * Visualizing {clicks.length} clicks. Red dots show exact click locations.
                </p>
                <p className="text-amber-600">
                    ⚠️ Some websites may block iframe embedding. If preview doesn't load, the URL may have X-Frame-Options restrictions.
                </p>
            </div>
        </div>
    );
};
