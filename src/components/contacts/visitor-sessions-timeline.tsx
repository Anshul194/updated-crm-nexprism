import { useEffect, useState } from "react";
import api from "@/lib/api-client";
import { format } from "date-fns";
import {
    Globe,
    Clock,
    Monitor,
    Smartphone,
    Tablet,
    ExternalLink,
    Calendar,
    MapPin,
    TrendingUp,
    MousePointer
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VisitorSession {
    _id: string;
    start_time: string;
    end_time: string;
    duration: number;
    landing_page: string;
    exit_page?: string;
    referrer_url: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    device_type: string;
    browser: string;
    os: string;
    page_views: number;
    events_count: number;
    is_bounce: boolean;
}

interface VisitorStats {
    lead_source: string;
    first_visit: string;
    last_visit: string;
    total_sessions: number;
    device_type: string;
    location: string;
}

export const VisitorSessionsTimeline = ({ email }: { email: string }) => {
    const [sessions, setSessions] = useState<VisitorSession[]>([]);
    const [stats, setStats] = useState<VisitorStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (email) {
            fetchSessions();
        }
    }, [email]);

    const fetchSessions = async () => {
        try {
            // Fetch visitor sessions
            const res = await api.get(`/tracking/visitor-sessions?email=${email}`);
            setSessions(res.data.sessions || []);
            setStats(res.data.stats || null);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const getDeviceIcon = (device?: string) => {
        switch (device?.toLowerCase()) {
            case 'mobile': return <Smartphone className="h-4 w-4" />;
            case 'tablet': return <Tablet className="h-4 w-4" />;
            default: return <Monitor className="h-4 w-4" />;
        }
    };

    const getSourceBadge = (session: VisitorSession) => {
        if (session.utm_source) {
            return <Badge variant="outline" className="bg-blue-50">{session.utm_source}</Badge>;
        }
        if (session.referrer_url) {
            try {
                const domain = new URL(session.referrer_url).hostname;
                return <Badge variant="outline" className="bg-green-50">{domain}</Badge>;
            } catch {
                return <Badge variant="outline">Referrer</Badge>;
            }
        }
        return <Badge variant="outline" className="bg-gray-50">Direct</Badge>;
    };

    const formatDuration = (seconds: number) => {
        if (seconds < 60) return `${seconds}s`;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    if (loading) return <div className="text-sm text-gray-500">Loading sessions...</div>;
    if (sessions.length === 0) return <div className="text-sm text-gray-500 italic">No sessions recorded yet.</div>;

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Globe className="h-4 w-4 text-blue-600" />
                                Lead Source
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-bold">{stats.lead_source}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-green-600" />
                                First Visit
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-semibold">{format(new Date(stats.first_visit), "MMM d, yyyy")}</p>
                            <p className="text-xs text-gray-500 mt-1">Last: {format(new Date(stats.last_visit), "MMM d, h:mm a")}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-purple-600" />
                                Total Sessions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{stats.total_sessions}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-red-600" />
                                Location
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-semibold">{stats.location}</p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                {getDeviceIcon(stats.device_type)}
                                {stats.device_type}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Sessions Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Session History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {sessions.map((session) => (
                            <div key={session._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        {/* Session Header */}
                                        <div className="flex items-center gap-2 mb-2">
                                            {getDeviceIcon(session.device_type)}
                                            <span className="font-semibold text-gray-900">
                                                {format(new Date(session.start_time), "MMM d, yyyy 'at' h:mm a")}
                                            </span>
                                            {getSourceBadge(session)}
                                            {session.is_bounce && <Badge variant="destructive" className="text-xs">Bounce</Badge>}
                                        </div>

                                        {/* Landing Page */}
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                            <ExternalLink className="h-3 w-3" />
                                            <span className="font-mono text-xs truncate max-w-md">{session.landing_page}</span>
                                        </div>

                                        {/* Exit Page */}
                                        {session.exit_page && session.exit_page !== session.landing_page && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                                <span className="italic">Last seen on:</span>
                                                <span className="font-mono truncate max-w-md">{session.exit_page}</span>
                                            </div>
                                        )}

                                        {/* Session Stats */}
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                <span>{formatDuration(session.duration || 0)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MousePointer className="h-3 w-3" />
                                                <span>{session.page_views} pages</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span>{session.events_count} events</span>
                                            </div>
                                        </div>

                                        {/* UTM Parameters */}
                                        {(session.utm_medium || session.utm_campaign) && (
                                            <div className="flex items-center gap-2 mt-2">
                                                {session.utm_medium && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        Medium: {session.utm_medium}
                                                    </Badge>
                                                )}
                                                {session.utm_campaign && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        Campaign: {session.utm_campaign}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Device & Browser Info */}
                                    <div className="text-right text-xs text-gray-500">
                                        <div>{session.browser}</div>
                                        <div>{session.os}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
