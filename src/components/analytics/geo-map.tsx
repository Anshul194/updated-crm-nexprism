import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import api from "@/lib/api-client";

// Type declaration for react-simple-maps if types are not available
declare module "react-simple-maps" {
    export const ComposableMap: any;
    export const Geographies: any;
    export const Geography: any;
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export const GeoMapChart = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tooltipContent, setTooltipContent] = useState("");

    useEffect(() => {
        setLoading(true);
        api.get('/tracking/geo-stats')
            .then(res => {
                console.log('Geo stats response:', res.data);
                if (Array.isArray(res.data)) {
                    setData(res.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Geo stats error:', err);
                setError(err.message || 'Failed to load geo data');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="w-full h-[400px] bg-sky-50/30 rounded-lg overflow-hidden relative border border-blue-100 flex items-center justify-center">
                <div className="text-sm text-gray-500">Loading geo data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-[400px] bg-red-50/30 rounded-lg overflow-hidden relative border border-red-100 flex items-center justify-center">
                <div className="text-sm text-red-600">Error: {error}</div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="w-full h-[400px] bg-gray-50/30 rounded-lg overflow-hidden relative border border-gray-100 flex items-center justify-center">
                <div className="text-sm text-gray-500">No visitor data available yet. Visitors will appear here once they visit your website.</div>
            </div>
        );
    }

    const maxValue = Math.max(...data.map((d: any) => d.value), 10);

    const colorScale = scaleLinear<string>()
        .domain([0, maxValue])
        .range(["#ffedea", "#ff5233"]);

    return (
        <div className="w-full h-[400px] bg-sky-50/30 rounded-lg overflow-hidden relative border border-blue-100">
            <ComposableMap projectionConfig={{ scale: 140 }}>
                <Geographies geography={geoUrl}>
                    {({ geographies }: { geographies: any[] }) =>
                        geographies.map((geo: any) => {
                            const countryData = data.find((s: any) =>
                                s.id === geo.properties.name ||
                                s.id === geo.id ||
                                geo.properties.name.includes(s.id)
                            );

                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={countryData ? colorScale(countryData.value) : "#D6D6DA"}
                                    stroke="#ffffff"
                                    strokeWidth={0.5}
                                    onMouseEnter={() => {
                                        setTooltipContent(`${geo.properties.name}: ${countryData ? countryData.value : 0} visitors`);
                                    }}
                                    onMouseLeave={() => {
                                        setTooltipContent("");
                                    }}
                                    style={{
                                        default: { outline: "none" },
                                        hover: { fill: "#F53", outline: "none", cursor: 'pointer' },
                                        pressed: { outline: "none" },
                                    }}
                                />
                            );
                        })
                    }
                </Geographies>
            </ComposableMap>
            {tooltipContent && (
                <div className="absolute top-4 right-4 bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none z-10">
                    {tooltipContent}
                </div>
            )}
        </div>
    );
};
