"use client"
import React, { useEffect, useRef, useState } from "react"

export default function Profile() {
    const [editing, setEditing] = useState(false)
    const fullNameRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (editing) fullNameRef.current?.focus()
    }, [editing])

    return(
        <div className="max-w-[1500px]  mx-auto px-8 py-8 flex flex-col gap-8 font-sans">
            {/* Heading */}
            <div className="bg-white flex flex-col gap-4 rounded-xl">
               {/* Banner */}
                <div className="w-full h-24 rounded-t-xl bg-gradient-to-r from-[#0f173e] to-[#1a2456]"></div>


               {/* Profile Info */}
               <div className="flex items-center justify-between p-8">

               
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-gray-300"></div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">John Doe</h2>
                        <p className="text-sm text-gray-500">johndoe@example.com</p>
                    </div>
                </div>

                <div>
                    <button
                        onClick={() => setEditing(prev => !prev)}
                        className="bg-[#0f173e] hover:bg-[#1a2456] text-white cursor-pointer py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        {editing ? "Cancel" : "Edit"}
                    </button>
                </div>
                </div>


               {/* Profile Details */}
               <h3 className="text-lg font-semibold text-gray-800 px-8">Personal Information</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 py-2 px-8 gap-6 mb-8">
                   {/* Full name */}
                   <div className="flex flex-col gap-2">
                       <label className="text-sm font-medium text-gray-700">Full Name</label>
                       <input
                           ref={fullNameRef}
                           type="text"
                           disabled={!editing}
                           className={`border border-gray-300 rounded-md py-2 px-4 focus:outline-none ${editing ? "focus:ring-2 focus:ring-green-500 bg-white" : "bg-gray-100 cursor-not-allowed"}`}
                           placeholder="John Doe"
                       />
                   </div>
                   {/* Username */}
                   <div className="flex flex-col gap-2">
                       <label className="text-sm font-medium text-gray-700">Username</label>
                       <input
                           type="text"
                           disabled={!editing}
                           className={`border border-gray-300 rounded-md py-2 px-4 focus:outline-none ${editing ? "focus:ring-2 focus:ring-green-500 bg-white" : "bg-gray-100 cursor-not-allowed"}`}
                           placeholder="johndoe"
                       />
                   </div>
                   {/* Email */}
                   <div className="flex flex-col gap-2">
                       <label className="text-sm font-medium text-gray-700">Email</label>
                       <input
                           type="email"
                           disabled={!editing}
                           className={`border border-gray-300 rounded-md py-2 px-4 focus:outline-none ${editing ? "focus:ring-2 focus:ring-green-500 bg-white" : "bg-gray-100 cursor-not-allowed"}`}
                           placeholder="john.doe@example.com"
                       />
                   </div>
                    {/* Gender  */}
                   <div className="flex flex-col gap-2">
                       <label className="text-sm font-medium text-gray-700">Gender</label>
                       <select
                           disabled={!editing}
                           className={`border border-gray-300 rounded-md py-2 px-4 focus:outline-none ${editing ? "focus:ring-2 focus:ring-green-500 bg-white" : "bg-gray-100 cursor-not-allowed"}`}
                       >
                           <option>Male</option>
                           <option>Female</option>
                           <option>Other</option>
                       </select>
                   </div>
               </div>

               {/* Academic Information */}
               <h3 className="text-lg font-semibold text-gray-800 px-8">Academic Information</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 py-2 px-8 gap-6">
                   {/* Faculty */}
                   <div className="flex flex-col gap-2">
                       <label className="text-sm font-medium text-gray-700">Faculty</label>
                       <input
                           type="text"
                           disabled={!editing}
                           className={`border border-gray-300 rounded-md py-2 px-4 focus:outline-none ${editing ? "focus:ring-2 focus:ring-green-500 bg-white" : "bg-gray-100 cursor-not-allowed"}`}
                           placeholder="Computer Science"
                       />
                   </div>
                   {/* Department */}
                   <div className="flex flex-col gap-2">
                       <label className="text-sm font-medium text-gray-700">Department</label>
                       <input
                           type="text"
                           disabled={!editing}
                           className={`border border-gray-300 rounded-md py-2 px-4 focus:outline-none ${editing ? "focus:ring-2 focus:ring-green-500 bg-white" : "bg-gray-100 cursor-not-allowed"}`}
                           placeholder="Mathematics"
                       />
                   </div>
                     {/* Academic Level */}
                   <div className="flex flex-col gap-2">
                       <label className="text-sm font-medium text-gray-700 ">Academic Level</label>
                       <select
                           disabled={!editing}
                           className={`border border-gray-300 rounded-md py-2 px-4 focus:outline-none ${editing ? "focus:ring-2 focus:ring-green-500 bg-white" : "bg-gray-100 cursor-not-allowed"}`}
                       >
                           <option>Level</option>
                           <option value="predegree">Pre-degree</option>
                           <option value="jupeb">Jupeb</option>
                           <option value="100">100</option>
                            <option value="200">200</option>
                            <option value="300">300</option>
                            <option value="400">400</option>
                            <option value="500">500</option>
                            <option value="600">600</option>
                            <option value="masters">Masters</option>
                            <option value="phd">PHD</option>
                       </select>
                   </div>
               </div>

               <div className="flex justify-start py-4 px-8">
                <button
                    disabled={!editing}
                    className={`bg-[#0f173e] text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${editing ? "hover:bg-[#1a2456]" : "opacity-60 cursor-not-allowed"}`}
                >
                    Save Changes
                </button>
               </div>
            </div>
        </div>
    );
}