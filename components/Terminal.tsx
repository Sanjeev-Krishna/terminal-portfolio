import React, { useState, useRef, useEffect } from 'react';
import { SKILLS, COMMANDS, LANGUAGES } from '../constants';
import type { Project, Experience, Education, Achievement } from '../types';

interface TerminalProps {
    projects: Project[];
    experiences: Experience[];
    education: Education[];
    achievements: Achievement[];
    isLoading: boolean;
}

const renderError = (command: string, type: 'NotFound' | 'InvalidFormat'): React.ReactNode[] => {
    const errorDetails = {
        NotFound: {
            message: `The term '${command}' is not recognized as a valid command. Check the spelling and try again. Type '/help' for a list of available commands.`,
            category: 'ObjectNotFound',
            exception: 'CommandNotFoundException',
            errorId: 'CommandNotFound',
        },
        InvalidFormat: {
            message: `The term '${command}' is not a valid command format. All commands must start with '/'.`,
            category: 'InvalidCommandFormat',
            exception: 'CommandFormatException',
            errorId: 'InvalidCommandFormat',
        }
    };

    const details = errorDetails[type];
    const commandLength = command.length > 0 ? command.length : 1;

    return [
        <div key="error" className="text-red-500">
            <p>
                {command} : {details.message}
            </p>
            <p>At line:1 char:1</p>
            <p>+ {command}</p>
            <p>+ {'~'.repeat(commandLength)}</p>
            <div className="whitespace-pre">
                <p>    + CategoryInfo          : {details.category}: ({command}:String) [], {details.exception}</p>
                <p>    + FullyQualifiedErrorId : {details.errorId}</p>
            </div>
        </div>
    ];
};

const StaggeredOutput: React.FC<{ children: React.ReactNode[], onFinished: () => void, onRenderLine: () => void }> = ({ children, onFinished, onRenderLine }) => {
    const [renderedChildren, setRenderedChildren] = useState<React.ReactNode[]>([]);
    
    useEffect(() => {
        onRenderLine();
    }, [renderedChildren, onRenderLine]);

    useEffect(() => {
        if (renderedChildren.length < children.length) {
            const timer = setTimeout(() => {
                setRenderedChildren(prev => [...prev, children[renderedChildren.length]]);
            }, 75);
            return () => clearTimeout(timer);
        } else {
            const finishTimer = setTimeout(onFinished, 0);
            return () => clearTimeout(finishTimer);
        }
    }, [renderedChildren, children, onFinished]);

    return <>{renderedChildren.map((child, index) => <div key={index} className="mb-2">{child}</div>)}</>;
};

const InputDisplay: React.FC<{ input: string; cursorPosition: number; isFocused: boolean; }> = ({ input, cursorPosition, isFocused }) => {
    const isCursorAtEnd = cursorPosition === input.length;

    const characters = input.split('').map((char, index) => (
        <span 
            key={index}
            className={isFocused && index === cursorPosition && !isCursorAtEnd ? 'blinking-cursor-block' : ''}
        >
            {char}
        </span>
    ));

    return (
        <div className="ml-2 flex items-center">
            <span style={{ whiteSpace: 'pre' }} className="text-white">
                {characters}
            </span>
            {isFocused && isCursorAtEnd && <span className="blinking-cursor" />}
        </div>
    );
};


const Terminal: React.FC<TerminalProps> = ({ projects, experiences, education, achievements, isLoading }) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<React.ReactNode[]>([]);
    const [isTyping, setIsTyping] = useState(true);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(0);
    const terminalBodyRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        if (terminalBodyRef.current) {
            terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [history]);

    useEffect(() => {
        if (!isLoading && !isTyping) {
            inputRef.current?.focus();
        }
    }, [isLoading, isTyping, history]);
    
    useEffect(() => {
        const welcomeNodes = [
            <p key="welcome-1">Welcome to Sanjeev’s Portfolio Terminal v1.0.0</p>,
            isLoading 
                ? <p key="loading">Loading portfolio data...</p>
                : <p key="help-prompt">Type `/help` to see the list of available commands.</p>,
        ];
        
        setHistory([
             <StaggeredOutput key="welcome" onFinished={() => setIsTyping(false)} onRenderLine={scrollToBottom}>
                {welcomeNodes}
            </StaggeredOutput>
        ]);
    }, [isLoading]);

    const processCommand = (command: string): React.ReactNode[] | null => {
        const [cmd, ...args] = command.toLowerCase().substring(1).split(' ');

        if (isLoading && !['help', 'clear'].includes(cmd)) {
            return [<div className="text-yellow-400">Portfolio data is still loading. Please try again shortly.</div>];
        }

        switch (cmd) {
            case 'help':
                const helpNodes: React.ReactNode[] = [
                    <p key="help-title">Available commands:</p>,
                    <ul key="help-list" className="list-disc list-inside">
                        {Object.entries(COMMANDS).map(([key, value]) => (
                            <li key={key}><span className="text-white">/{key}</span> - {value}</li>
                        ))}
                    </ul>
                ];
                return [<div className="text-green-400">{helpNodes}</div>];
            case 'clear':
                setIsTyping(true);
                const welcomeNodes = [
                    <p key="welcome-1">Welcome to Sanjeev’s Portfolio Terminal v1.0.0</p>,
                    <p key="help-prompt">Type `/help` to see the list of available commands.</p>,
                ];
                setHistory([
                     <StaggeredOutput key="welcome-clear" onFinished={() => setIsTyping(false)} onRenderLine={scrollToBottom}>
                        {welcomeNodes}
                    </StaggeredOutput>
                ]);
                return null;
            case 'projects':
                const projectNodes: React.ReactNode[] = [];
                projects.forEach((project: Project) => {
                    projectNodes.push(<p key={`${project.id}-title`} className="text-white font-bold">{project.id}. {project.title}</p>);
                    projectNodes.push(<p key={`${project.id}-desc`} className="pl-4">- {project.description}</p>);
                    projectNodes.push(<p key={`${project.id}-tech`} className="pl-4 text-cyan-400">Tech: {project.technologies.join(', ')}</p>);
                    projectNodes.push(
                         <a key={`${project.id}-link`} href={project.githubLink} target="_blank" rel="noopener noreferrer" className="pl-4 text-blue-400 underline hover:text-blue-300">
                            GitHub Profile
                        </a>
                    );
                });
                return projectNodes.length > 0 ? [<div className="text-green-400 space-y-2">{projectNodes}</div>] : [<p className="text-yellow-400">No projects found.</p>];
             case 'experience':
                const expNodes: React.ReactNode[] = [];
                experiences.forEach((exp: Experience) => {
                    expNodes.push(<p key={`${exp.id}-company`} className="text-white font-bold">{exp.company} - {exp.role}</p>);
                    expNodes.push(<p key={`${exp.id}-period`} className="pl-4 text-gray-400">{exp.period}</p>);
                    exp.description.forEach((desc, i) => {
                        expNodes.push(<p key={`${exp.id}-desc-${i}`} className="pl-4">{desc}</p>);
                    });
                });
                return expNodes.length > 0 ? [<div className="text-green-400 space-y-2">{expNodes}</div>] : [<p className="text-yellow-400">No experience found.</p>];
            case 'profile':
                 const profileNodes: React.ReactNode[] = [
                    <div key="summary">
                        <p className="text-white font-bold text-lg mb-2 underline">Executive Summary</p>
                        <p>Engineering student with a strong academic record (CGPA 9.33) and proven ability in problem-solving and software development. Skilled in Python, C++, Django, Arduino, and full-stack development, with experience building practical, end-to-end projects. Recognized for adaptability, teamwork, and consistent excellence in both academic and extracurricular pursuits.</p>
                    </div>,
                     <div key="education">
                        <p className="text-white font-bold text-lg mb-2 underline">Education</p>
                        {education.map((edu: Education) => (
                            <div key={edu.id} className="mb-4">
                                <p className="text-white font-bold">{edu.institution}</p>
                                {edu.degree.map((d, i) => <p key={i} className="pl-4">{d}</p>)}
                                <p className="pl-4 text-gray-400">{edu.period}</p>
                            </div>
                        ))}
                    </div>,
                     <div key="achievements-profile">
                        <p className="text-white font-bold text-lg mb-2 underline">Achievements</p>
                        <ul className="list-disc list-inside pl-4">
                            {achievements.map((ach: Achievement) => <li key={ach.id}>{ach.description}</li>)}
                        </ul>
                    </div>,
                     <div key="skills">
                        <p className="text-white font-bold text-lg mb-2 underline">Skills</p>
                        {Object.entries(SKILLS).map(([category, skills]) => (
                            <div key={category} className="mb-2">
                                <p className="text-white font-bold">{category}:</p>
                                <p className="pl-4">{skills.join(', ')}</p>
                            </div>
                        ))}
                    </div>,
                     <div key="languages">
                        <p className="text-white font-bold text-lg mb-2 underline">Languages</p>
                        <ul className="list-disc list-inside pl-4">
                            {Object.entries(LANGUAGES).map(([lang, level]) => <li key={lang}>{lang} ({level})</li>)}
                        </ul>
                    </div>
                ];
                return [<div className="text-green-400 space-y-6">{profileNodes}</div>];
            case 'contact':
                const contactNodes: React.ReactNode[] = [
                    <p key="contact-1">You can reach me via:</p>,
                    <p key="contact-2">- Email: <a href="mailto:sanjeevkrishna06@gmail.com" className="text-blue-400 underline hover:text-blue-300">sanjeevkrishna06@gmail.com</a></p>,
                    <p key="contact-3">- LinkedIn: <a href="https://www.linkedin.com/in/sanjeevkrishna06/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">linkedin.com/in/sanjeevkrishna06</a></p>
                ];
                return [<div className="text-green-400">{contactNodes}</div>];
            default:
                return renderError(command, 'NotFound');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        setCursorPosition(e.target.selectionStart ?? e.target.value.length);
    };
    
    const handleSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
        setCursorPosition(e.currentTarget.selectionStart ?? 0);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isTyping) {
            const command = input.trim();
            const commandNode = (
                <div key={`cmd-${history.length}`} className="flex items-center">
                    <span className="text-blue-400">sanjeev@portfolio:~$</span>
                    <span className="ml-2 text-white">{command || ''}</span>
                </div>
            );
            
            if (command) {
                let output: React.ReactNode[] | null = null;
                if(command.startsWith('/')) {
                    output = processCommand(command);
                } else {
                    output = renderError(command, 'InvalidFormat');
                }

                if (command.toLowerCase() !== '/clear') {
                    setIsTyping(true);
                    const outputNode = output ? (
                         <StaggeredOutput key={`out-${history.length}`} onFinished={() => setIsTyping(false)} onRenderLine={scrollToBottom}>
                            {output}
                        </StaggeredOutput>
                    ) : null;
                    if(outputNode) {
                         setHistory(prev => [...prev, commandNode, outputNode]);
                    } else {
                         setHistory(prev => [...prev, commandNode]);
                         setIsTyping(false);
                    }
                }
            } else {
                 setHistory(prev => [...prev, commandNode]);
            }
            setInput('');
            setCursorPosition(0);
        }
    };

    const focusInput = () => {
        inputRef.current?.focus();
    };

    return (
        <div 
            className="h-[70vh] lg:h-full bg-black rounded-2xl shadow-2xl flex flex-col font-['Consolas',_'Menlo',_'Monaco',_'Courier_New',_monospace] text-lg" 
            onClick={focusInput}
        >
            <div ref={terminalBodyRef} className="flex-1 p-4 overflow-y-auto text-gray-300 leading-relaxed min-h-0">
                {history}
                
                {!isTyping && (
                    <div className="flex items-center">
                        <span className="text-blue-400">sanjeev@portfolio:~$</span>
                        <InputDisplay 
                            input={input}
                            cursorPosition={cursorPosition}
                            isFocused={isInputFocused}
                        />
                        <input
                            ref={inputRef}
                            id="terminal-input"
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onSelect={handleSelect}
                            className="absolute opacity-0 w-0 h-0"
                            autoFocus
                            autoComplete="off"
                            onFocus={() => setIsInputFocused(true)}
                            onBlur={() => setIsInputFocused(false)}
                            disabled={isTyping}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Terminal;