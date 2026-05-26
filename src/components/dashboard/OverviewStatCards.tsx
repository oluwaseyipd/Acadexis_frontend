"use client"

import { BookOpen, FileText, TrendingUp, FileQuestionMark} from "lucide-react";


type StatCard = {
    title: string;
    value: string;
    icon: React.ReactNode;
}

const stats: StatCard[] = [
    {
        title: "Courses Enrolled",
        value: "5",
        icon: <BookOpen className="w-5 md:w-10 h-5 md:h-10" />,
    },
    {
        title: "Materials Read",
        value: "5",
        icon: <FileText className="w-5 md:w-10 h-5 md:h-10" />,
    },
    {
        title: "AI Questions",
        value: "85%",
        icon: <TrendingUp className="w-5 md:w-10 h-5 md:h-10" />,
    },
    {
        title: "Quizzes Taken",
        value: "12",
        icon: <FileQuestionMark className="w-5 md:w-10 h-5 md:h-10" />,
    }
];


export default function OverviewStatCards() {
    return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5 md:mt-10">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm md:shadow-md p-6">
              <div className="flex items-center gap-4">
                
                <div className="text-blue-500 ">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0f173e]">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
    )
}