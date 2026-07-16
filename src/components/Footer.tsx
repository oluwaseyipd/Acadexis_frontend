'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[#002147] text-white px-3 md:px-6 py-8 mt-[70px]">
            <div className="w-full  md:max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="w-full md:w-[400px] mb-4 md:mb-0">
                        <Link href="/" className="text-2xl font-bold text-green-500">
                            ACADEXIS 
                        </Link>
                        <p className='text-gray-300 mt-4'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae, sequi odit ducimus quam hic earum</p>
                        <p className="mt-4 text-gray-400">
                        &copy; {new Date().getFullYear()} Acadexis. All rights reserved.
                        </p>
                    </div>
                    <div className="flex flex-wrap md:flex-nowrap space-x-6 space-y-4 md:space-y-0">
                        <Link href="/" className="text-gray-400 hover:text-green-500 transition-colors">
                            Academic Integrity
                        </Link>
                        <Link href="/privacy" className="text-gray-400 hover:text-green-500 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-gray-400 hover:text-green-500 transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="/transparency" className="text-gray-400 hover:text-green-500 transition-colors">
                            Institutional Access
                        </Link>
                    </div>
                </div>
                
            </div>
        </footer>
        
        );
}