import React, { useState, useEffect } from 'react';
import ProfileCard from './components/ProfileCard';
import Terminal from './components/Terminal';
import type { Project, Experience, Education, Achievement } from './types';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const parseCSV = <T extends object>(csvText: string, arrayFields: string[] = []): T[] => {
      const lines = csvText.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      return lines.slice(1).map(line => {
        const values = line.split(',');
        const entry = headers.reduce((obj, header, index) => {
          const value = values[index] ? values[index].trim().replace(/^"|"$/g, '') : '';
          if (arrayFields.includes(header)) {
            (obj as any)[header] = value.split('|').map(item => item.trim());
          } else {
            (obj as any)[header] = value;
          }
          return obj;
        }, {} as T);
        return entry;
      });
    };
    
    const fetchData = async () => {
      try {
        const [projectsRes, expRes, eduRes, achieveRes] = await Promise.all([
          fetch('/data/projects.csv'),
          fetch('/data/experience.csv'),
          fetch('/data/education.csv'),
          fetch('/data/achievements.csv')
        ]);

        const projectsText = await projectsRes.text();
        const expText = await expRes.text();
        const eduText = await eduRes.text();
        const achieveText = await achieveRes.text();

        setProjects(parseCSV<Project>(projectsText, ['technologies']));
        setExperiences(parseCSV<Experience>(expText, ['description']));
        setEducation(parseCSV<Education>(eduText, ['degree']));
        setAchievements(parseCSV<Achievement>(achieveText));
        
      } catch (error) {
        console.error("Failed to load portfolio data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-screen bg-[#101418] text-white p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <main className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 h-full overflow-y-auto lg:h-auto lg:overflow-visible">
        <div className="lg:col-span-1">
          <ProfileCard />
        </div>
        <div className="lg:col-span-2 lg:h-[85vh]">
          <Terminal 
            projects={projects}
            experiences={experiences}
            education={education}
            achievements={achievements}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default App;