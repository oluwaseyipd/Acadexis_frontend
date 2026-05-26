

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
          <h1 className="text-7xl">HOME PAGE</h1>

          <div className="flex gap-4 mt-8">
            <a 
            className="bg-[#0f173e] hover:bg-[#1a2456] text-white cursor-pointer py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            href="/auth/register">Sign Up</a>
            <a 
            className="bg-[#0f173e] hover:bg-[#1a2456] text-white cursor-pointer py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            href="/auth/login">Sign In</a>
            <a 
            className="bg-[#0f173e] hover:bg-[#1a2456] text-white cursor-pointer py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            href="/dashboard/student">Dashboard</a>

          </div>

    </div>
  );
}
