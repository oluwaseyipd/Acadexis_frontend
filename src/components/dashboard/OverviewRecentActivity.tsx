"use client"


type RecentActivity = {
    title: string;
    description: string;
    timestamp: string;
}

type RecentUpdates = {
    title: string;
    description: string;
    timestamp: string;
}


const recentActivities: RecentActivity[] = [
    {
        title: "Completed Course: React Basics",
        description: "You completed the React Basics course and earned a certificate.",
        timestamp: "2 hours ago"
    },
    {
        title: "Quiz Attempted: JavaScript Fundamentals",
        description: "You attempted the JavaScript Fundamentals quiz and scored 85%.",
        timestamp: "1 day ago"
    },
    {
        title: "AI Question Asked",
        description: "You asked an AI question about CSS Flexbox.",
        timestamp: "3 days ago"
    }
];



const recentUpdates: RecentUpdates[] = [
    {
        title: "New Course Available",
        description: "Check out our latest course on React development.",
        timestamp: "2 hours ago"
    },
    {
        title: "Quiz Results Published",
        description: "Your results for the recent quiz are now available.",
        timestamp: "1 day ago"
    },
    {
        title: "AI Question Answered",
        description: "Your AI question about JavaScript has been answered.",
        timestamp: "3 days ago"
    }
];

export default function OverviewRecentActivity() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">

            {/* Recent Activity */}
            <div className="flex flex-col gap-1 md:col-span-2">
            <h2 className="text-xl font-bold text-[#0f173e] mb-4">Recent Activity</h2>

           <div className="bg-white rounded-lg shadow-md p-6 flex-1">
                <ul className="space-y-3">
                    {recentActivities.map((activity, index) => (
                        <li key={index} className="border-b border-gray-200 pb-3">
                            <h3 className="font-bold text-[#0f173e]">{activity.title}</h3>
                            <p className="text-sm text-gray-500">{activity.description}</p>
                            <span className="text-xs text-gray-400">{activity.timestamp}</span>
                        </li>
                    ))}
                </ul>
            </div>
            </div>

            {/* New Updates */}
            <div className="flex flex-col gap-1 md:col-span-1 mt-4 md:mt-0">
                 <h2 className="text-xl font-bold text-[#0f173e] mb-4">New Updates</h2>
            <div className="bg-white rounded-lg shadow-md p-6 flex-1">
               
                <ul className="space-y-3">
                    {recentUpdates.map((update, index) => (
                        <li key={index} className="border-b border-gray-200 pb-3">
                            <h3 className="font-bold text-[#0f173e]">{update.title}</h3>
                            <p className="text-sm text-gray-500">{update.description}</p>
                            <span className="text-xs text-gray-400">{update.timestamp}</span>
                        </li>
                    ))}
                </ul>
            </div>
            </div>
           
        </div>
    )
}