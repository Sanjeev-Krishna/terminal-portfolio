import React from 'react';
import { MailIcon, PhoneIcon, LocationIcon, GithubIcon, LinkedinIcon } from './Icons';

const ProfileCard: React.FC = () => {
  return (
    <div className="relative bg-[#1c1f26] rounded-2xl p-6 flex flex-col shadow-2xl overflow-hidden">
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-4xl font-black text-gray-900 shadow-lg">
            SK
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Sanjeev Krishna</h1>
            <p className="text-green-400 text-md sm:text-lg">Engineering Sophomore</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3 text-gray-300">
            <MailIcon className="w-5 h-5 text-green-400" />
            <a href="mailto:sanjeevkrishna06@gmail.com" className="hover:text-white transition-colors">sanjeevkrishna06@gmail.com</a>
          </div>
          <div className="flex items-center space-x-3 text-gray-300">
            <PhoneIcon className="w-5 h-5 text-green-400" />
            <span>+91 9789830971</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-300">
            <LocationIcon className="w-5 h-5 text-green-400" />
            <span>Chennai, India</span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Socials & Status */}
        <div className="mt-auto">
          <div className="flex justify-center space-x-6 mb-6">
            <a href="https://github.com/Sanjeev-Krishna" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-transform duration-300 hover:scale-110">
              <GithubIcon className="w-8 h-8" />
            </a>
            <a href="https://www.linkedin.com/in/sanjeevkrishna06/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-transform duration-300 hover:scale-110">
              <LinkedinIcon className="w-8 h-8" />
            </a>
          </div>
          <div className="border-t border-gray-700 pt-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="font-sans">Available for Hire</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;