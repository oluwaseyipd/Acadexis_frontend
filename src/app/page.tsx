
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from 'next/link';
import { BookOpenCheck, Check, MapPin, ShieldCheck, ShieldCogCorner, SquareFunction } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-gray-50">
      {/* Navbar */}
      <Navbar />

    {/* Hero Section */}
    <div className="flex flex-col items-center justify-center bg-[#002147]">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 ">
        <div className="grid  grid-cols-1 md:grid-cols-2  items-center text-left justify-between space-y-16 md:space-y-0">
       
       {/* Left Side */}
        <div className="flex flex-col items-start space-y-6 w-full md:max-w-3xl">
          <h1 className="text-6xl text-white hidden md:block">AI YOU CAN <br/>TRUST. <br/><span className="text-green-600">EDUCATION</span> YOU <br/>CAN VERIFY</h1>
           <h1 className="text-3xl text-white block md:hidden">AI YOU CAN TRUST. <span className="text-green-600">EDUCATION</span> YOU CAN VERIFY</h1>
          <p className="max-w-[600px]  text-lg text-[#708AB5] mt-2">
              Transforming the academic landscape with AI that doesn't just answer-it proves. Every insight is anchored in peer-reviewes precision.          
          </p>
       
          <div className="flex flex-col md:flex-row items-start md:items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            <Link href="/auth/register" className="px-3 md:px-6 py-2 md:py-4 text-[#002147] rounded-full bg-[#83FBA5] hover:bg-[#83FBA5]/90 transition-colors font-semibold">
              Join the Digital Anthenaeum
            </Link>
            <Link href="/features" className="px-3 md:px-6 py-2 md:py-4 text-white rounded-full bg-transparent border-2 border-gray-600 hover:text-gray-300 transition-colors font-semibold">
             Watch the Vision
            </Link>
          </div> 
        </div>

    {/* Right Side */}
        <div className="w-full md:w-[700px] h-[300px] bg-[#d2d7f1] rounded-2xl flex items-center justify-center">
        
        </div>
        </div>
      </div>
    </div>


      {/* User Comparison */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-32 space-y-8">

        <div className="text-center space-y-4">
          <h1 className="text-5xl text-black">Design for the Entire Academy</h1>
          <p className="max-w-[800px] text-center text-lg text-gray-600 mx-auto mt-2">
            Whether you are pushing the boundaries of research or fostering the next generation of thinkers, our tools adapt to your specific workflow.
          </p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-16 md:py-32 space-x-0 md:space-x-4">
       {/* Student Card */}
        <div className="flex flex-col items-start bg-white p-8 space-y-4 rounded-2xl shadow-md">
          <div className="flex items-center justify-center w-16 h-16 bg-[#002147]/70 rounded-xl">
            <BookOpenCheck className="text-white w-8 h-8" />
          </div>

          <h2 className="text-xl font-semibold text-black mt-4">For Students</h2>
          <p className=" text-gray-700 mt-2">
            Learn with Citations. Stop guessing if your AI sources are real. Our student suite automatically fact-checks every claim against your course syllabus and global databases.
          </p>

          <div className="flex flex-col space-y-4 mt-4">
            <span>
              <Check className="inline-block mr-2 text-white bg-green-600 rounded-full p-1" />
              Instant PDF Annotation</span>
            <span>
              <Check className="inline-block mr-2 text-white bg-green-600 rounded-full p-1" />
              Source-only Knowledge Base</span>
            <span>
              <Check className="inline-block mr-2 text-white bg-green-600 rounded-full p-1" />
              Academic Integrity Guard</span>
          </div>

          <Link href="/auth/register" className="px-6 py-3 text-xl text-green-600 transition-colors font-semibold mt-4">
            Master Your Studies {"->"}
          </Link> 
        </div>

               {/* Lecturer Card */}
        <div className="flex flex-col items-start bg-[#002147] p-8 space-y-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-center w-16 h-16 bg-[#83FBA5] rounded-xl">
            <SquareFunction className="text-[#002147] w-10 h-10" />
          </div>

          <h2 className="text-xl font-semibold text-white mt-4">For Lecturers</h2>
          <p className=" text-[#708AB5] mt-2">
            Learn with Citations. Stop guessing if your AI sources are real. Our student suite automatically fact-checks every claim against your course syllabus and global databases.
          </p>

          <div className="flex flex-col space-y-4 mt-4">
            <span className="text-[#D6E3FF]">
              <ShieldCheck className="inline-block mr-2 text-white bg-green-600 rounded-full p-1" />
              Instant PDF Annotation</span>
            <span className="text-[#D6E3FF]">
              <ShieldCheck className="inline-block mr-2 text-white bg-green-600 rounded-full p-1" />
              Source-only Knowledge Base</span>
            <span className="text-[#D6E3FF]">
              <ShieldCheck className="inline-block mr-2 text-white bg-green-600 rounded-full p-1" />
              Academic Integrity Guard</span>
          </div>

          <Link href="/auth/register" className="px-6 py-3 text-xl text-[#83FBA5] transition-colors font-semibold mt-4">
            Master Your Studies {"->"}
          </Link> 
        </div>
      </div>
      </div>


    {/* Product Advantage point */}
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8  space-y-16 md:space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-16 md:py-32 space-x-4">
              <div className="w-full md:w-[700px] h-[600px] bg-[#d2d7f1] rounded-2xl flex items-center justify-center"></div>
      <div className="flex flex-col items-start space-y-6 w-full md:max-w-xl">
        <h1 className="text-3xl md:text-5xl font-semibold text-[#191C1D]">Beyond the Black Box.</h1>
        <p className="text-[#44474E]">Most AI "hallucinates" when it doesn't know the answer. We built a proprietary verification engine that forces the AI to visually anchor every response to a specific coordinate within your documents.</p>
     
     
       <div className="flex flex-row items-start justify-between space-x-4 mt-8">
  <span className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-full flex-shrink-0">
    <MapPin className="w-6 h-6 md:w-8 md:h-8 text-[#191C1D]" />
  </span>
  <div className="flex flex-col items-start space-y-2">
    <h2 className="text-xl font-bold text-[#191C1D]">Coordinate-Level Citations</h2>
    <p className="text-[#44474E]">
      Click any answer to jump exactly to the line and paragraph of the source material.
    </p>
  </div>
</div>

   <div className="flex flex-row items-start justify-between space-x-4 mt-8">
  <span className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-full flex-shrink-0">
    <ShieldCogCorner className="w-6 h-6 md:w-8 md:h-8 text-[#191C1D]" />
  </span>
  <div className="flex flex-col items-start space-y-2">
    <h2 className="text-xl font-bold text-[#191C1D]">Hallucination Blocking</h2>
    <p className="text-[#44474E]">
      If the truth isn't in your data, the AI says "I don't know" rather than inventing facts.
    </p>
  </div>
</div>

      </div>
      </div>
    </div> 




    <div className="flex flex-col bg-[#002147] space-y-4">
    {/* CTA */}
    <div className=" flex flex-col items-center justify-center bg-[#002147] text-center px-3 md:px-6 py-16 md:py-32 space-y-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-semibold text-white">THE FUTURE IS ANCHORED.</h1>
        <p className="max-w-[600px] text-lg text-gray-300 mx-auto mt-4">
          Join the Digital Anthenaeum and experience the first AI designed specially for the rigors of institutional excellence.
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
        <Link href="/auth/register" className="px-3 md:px-6 py-2 md:py-4 text-white rounded-full bg-green-600 hover:bg-green-700 transition-colors font-semibold">
          Join the Digital Anthenaeum
        </Link>
        <Link href="/features" className="px-3 md:px-6 py-2 md:py-4 text-white rounded-full bg-transparent border-2 border-gray-600 hover:text-gray-300 transition-colors font-semibold">
          Request Institutional Pilot
        </Link>
      </div>
    </div>

    {/* Footer */}
      <Footer />
      </div>
    </div>
  );
}
