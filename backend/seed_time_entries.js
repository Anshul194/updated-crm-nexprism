const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('>>> DB CONNECTED <<<'))
    .catch(err => {
        console.log('>>> DB ERROR <<<');
        console.log(err.message);
        process.exit(1);
    });

const TimeEntry = require('./models/TimeEntry');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

async function seedTimeEntries() {
    try {
        console.log('Starting time entry seeding...');

        // Get existing users, projects, and tasks
        const users = await User.find();
        const projects = await Project.find();
        const tasks = await Task.find();

        if (users.length === 0 || projects.length === 0) {
            console.log('No users or projects found. Please seed users and projects first.');
            process.exit(1);
        }

        console.log(`Found ${users.length} users, ${projects.length} projects, ${tasks.length} tasks`);

        // Clear existing time entries
        await TimeEntry.deleteMany({});
        console.log('Cleared existing time entries');

        // Create sample time entries
        const timeEntries = [];
        const now = new Date();

        // Helper function to get random item from array
        const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        // Helper function to get date offset
        const getDaysAgo = (days) => {
            const date = new Date();
            date.setDate(date.getDate() - days);
            return date;
        };

        // Create entries for the past 30 days
        for (let i = 0; i < 30; i++) {
            const entriesPerDay = Math.floor(Math.random() * 3) + 1; // 1-3 entries per day

            for (let j = 0; j < entriesPerDay; j++) {
                const user = getRandom(users);
                const project = getRandom(projects);
                const task = tasks.find(t => t.projectId.toString() === project._id.toString()) || null;

                const startDate = getDaysAgo(i);
                startDate.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60), 0, 0);

                const duration = Math.floor(Math.random() * 240) + 30; // 30-270 minutes
                const endDate = new Date(startDate.getTime() + duration * 60000);

                const notes = [
                    'Working on feature implementation',
                    'Bug fixing and testing',
                    'Code review and documentation',
                    'Client meeting and requirements gathering',
                    'Development and deployment',
                    'Research and planning',
                    'UI/UX improvements',
                    'Database optimization',
                    'API integration',
                    'Testing and QA'
                ];

                timeEntries.push({
                    userId: user._id,
                    projectId: project._id,
                    taskId: task ? task._id : undefined,
                    startTime: startDate,
                    endTime: endDate,
                    duration: duration,
                    note: getRandom(notes),
                    isRunning: false
                });
            }
        }

        // Add one running timer for the first user
        const runningUser = users[0];
        const runningProject = projects[0];
        const runningTask = tasks.find(t => t.projectId.toString() === runningProject._id.toString());

        const runningStart = new Date();
        runningStart.setHours(runningStart.getHours() - 2); // Started 2 hours ago

        timeEntries.push({
            userId: runningUser._id,
            projectId: runningProject._id,
            taskId: runningTask ? runningTask._id : undefined,
            startTime: runningStart,
            duration: 0,
            note: 'Currently working on this task',
            isRunning: true
        });

        // Insert all time entries
        const created = await TimeEntry.insertMany(timeEntries);
        console.log(`✓ Created ${created.length} time entries`);

        // Show summary
        const totalHours = timeEntries.reduce((sum, entry) => sum + entry.duration, 0) / 60;
        console.log(`\nSummary:`);
        console.log(`- Total entries: ${created.length}`);
        console.log(`- Total hours logged: ${totalHours.toFixed(2)}h`);
        console.log(`- Running timers: 1`);
        console.log(`- Date range: ${getDaysAgo(29).toLocaleDateString()} to ${now.toLocaleDateString()}`);

        console.log('\n✓ Time entry seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding time entries:', error);
        process.exit(1);
    }
}

seedTimeEntries();
