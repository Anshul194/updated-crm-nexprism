const API_BASE_URL = 'http://localhost:5000/api';

export interface TimeEntry {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    projectId: {
        _id: string;
        name: string;
        status: string;
    };
    taskId?: {
        _id: string;
        title: string;
        status: string;
    };
    startTime: Date;
    endTime?: Date;
    duration: number; // in minutes
    note: string;
    isRunning: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface TimeEntryStats {
    totalHours: number;
    todayHours: number;
    activeTimers: number;
    totalEntries: number;
}

export const timeEntryService = {
    // Get all time entries with optional filters
    async getAll(filters?: {
        userId?: string;
        projectId?: string;
        taskId?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<TimeEntry[]> {
        const params = new URLSearchParams();
        if (filters?.userId) params.append('userId', filters.userId);
        if (filters?.projectId) params.append('projectId', filters.projectId);
        if (filters?.taskId) params.append('taskId', filters.taskId);
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);

        const response = await fetch(`${API_BASE_URL}/time-entries?${params}`);
        if (!response.ok) throw new Error('Failed to fetch time entries');
        return response.json();
    },

    // Get a single time entry by ID
    async getById(id: string): Promise<TimeEntry> {
        const response = await fetch(`${API_BASE_URL}/time-entries/${id}`);
        if (!response.ok) throw new Error('Failed to fetch time entry');
        return response.json();
    },

    // Create a new time entry (start timer)
    async create(data: {
        userId: string;
        projectId: string;
        taskId?: string;
        note?: string;
        startTime?: Date;
        isRunning?: boolean;
    }): Promise<TimeEntry> {
        const response = await fetch(`${API_BASE_URL}/time-entries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create time entry');
        return response.json();
    },

    // Update a time entry (stop timer, update note, etc.)
    async update(id: string, data: {
        endTime?: Date;
        duration?: number;
        note?: string;
        isRunning?: boolean;
    }): Promise<TimeEntry> {
        const response = await fetch(`${API_BASE_URL}/time-entries/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update time entry');
        return response.json();
    },

    // Delete a time entry
    async delete(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/time-entries/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete time entry');
    },

    // Get running timer for a user
    async getRunningTimer(userId: string): Promise<TimeEntry | null> {
        const response = await fetch(`${API_BASE_URL}/time-entries/user/${userId}/running`);
        if (!response.ok) throw new Error('Failed to fetch running timer');
        return response.json();
    },

    // Get time statistics
    async getStats(filters?: {
        userId?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<TimeEntryStats> {
        const params = new URLSearchParams();
        if (filters?.userId) params.append('userId', filters.userId);
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);

        const response = await fetch(`${API_BASE_URL}/time-entries/stats/summary?${params}`);
        if (!response.ok) throw new Error('Failed to fetch time statistics');
        return response.json();
    },

    // Start a timer
    async startTimer(userId: string, projectId: string, taskId?: string, note?: string): Promise<TimeEntry> {
        return this.create({
            userId,
            projectId,
            taskId,
            note,
            startTime: new Date(),
            isRunning: true
        });
    },

    // Stop a timer
    async stopTimer(id: string, note?: string): Promise<TimeEntry> {
        return this.update(id, {
            endTime: new Date(),
            isRunning: false,
            note
        });
    }
};
