"use client";
 

export default function QuizPage() {
 
    return(
       <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-8 font-sans">
      {/* Heading */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <h1 className="text-4xl font-bold text-[#0f173e] tracking-tight leading-tight font-geist-sans">
              Quizzes
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed max-w-120">
                Test your knowledge and reinforce your learning with AI-generated quizzes from the course content. 
            </p>
          </div>
        </div>
      </div>

      
    </div>
    );
}