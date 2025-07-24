import React, {useState, useRef, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import { saveNote,getNotes } from '../services/api';
import { summarizeNote } from '../services/api';
import {Sun, Moon, Bold, Italic, List, Heading} from 'lucide-react';

const MarkdownEditor = () => {
    const [markdown, setMarkdown] = useState("# Hello, Markdown");
    const textareaRef = useRef(null);
    const [darkMode, setDarkMode] = useState(false);
    const [notes, setNotes] = useState([]);
    const [summary, setSummary] = useState("");
    // const [content, setContent] = useState("");

    const handleSave = async (content) => {
        console.log(content);
        const saved = await saveNote(content);
        console.log("Note saved:",saved);
        fetchNotes();
    };

    const fetchNotes = async () => {
        const data = await getNotes();
        setNotes(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        fetchNotes();
    },[]);

    useEffect(() => {
        const root = window.document.documentElement;

        if (darkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [darkMode]);

    const insertAtCursor = (before, after="") => {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = markdown.slice(start,end);
        const updated = markdown.slice(0, start) + before + selected + after + markdown.slice(end);
        setMarkdown(updated);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start+before.length, end+after.length);
        },0);
    };

    const handleSummarize = async () => {
        const res = await summarizeNote(markdown);
        if(res.summary){
            setSummary(res.summary);
        }else{
            setSummary("Could not generate summary");
        }
    };

    return(
        <div>
            <div className="flex flex-col md:flex-row h-screen dark:bg-zinc-900 dark: transition-all duration-300">
                {/* Sidebar with note list */}
                <div className="w-1/4 border-r p-4 overflow-y-auto">
                    <h2 className="text-lg font-bold mb-2 dark:text-white">Saved Notes</h2>
                    {notes.map((note) => (
                    <div
                        key={note._id}
                        className="cursor-pointer mb-2 p-2 bg-gray-100 rounded hover:bg-gray-200"
                        onClick={() => setMarkdown(note.content)}
                    >
                        {note.content.slice(0, 30)}...
                    </div>
                    ))}
                </div>
                {/* Editor panel */}
                <div className='w-full md:w-1/2 flex flex-col border-r dark:border-zinc-700'>
                    {/* Toolbar */}
                    <div className='flex justify-between items-center px-4 py-2 border-b dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800'>
                        <div className='flex gap-2'>
                            <button onClick={() => insertAtCursor("**","**")} className="text-black px-2 py-1 bg-white border rounded hover:bg-gray-200 dark:hover:bg-zinc-700" title="Bold"><Bold size={18} /></button>
                            <button onClick={() => insertAtCursor("*","*")} className="text-black px-2 py-1 bg-white border rounded hover:bg-gray-200 dark:hover:bg-zinc-700" title="Italic"><Italic size={18} /></button>
                            <button onClick={() => insertAtCursor("# ","")} className="text-black px-2 py-1 bg-white border rounded hover:bg-gray-200 dark:hover:bg-zinc-700" title="Heading"><Heading size={18} /></button>
                            <button onClick={() => insertAtCursor("- ","")} className="text-black px-2 py-1 bg-white border rounded hover:bg-gray-200 dark:hover:bg-zinc-700" title="List"><List size={18} /></button>
                        </div>
                        <button
                        onClick={() => setDarkMode(!darkMode)}
                        className='p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-700'
                        title = 'Toggle Dark Mode'
                        >{darkMode ? <Sun className='dark:text-white' size={18} /> : <Moon size={18}/>}</button>
                    </div>
                    {/*Textarea*/}
                    <textarea ref = {textareaRef}
                    value = {markdown}
                    onChange={(e) => {setMarkdown(e.target.value)}}
                    className='flex-1 p-4 text-base bg-white dark:bg-zinc-900 dark:text-white focus:outline-none resize-none'
                    placeholder='Write your markdown here.....'
                    />
                    <button
                        onClick={() => handleSave(markdown)}
                        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                        Save Note
                    </button>
                    <button
                    onClick={handleSummarize}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                    Summarize
                    </button>
                    {summary && (
                    <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-black rounded">
                        <h3 className="font-bold mb-2">AI Summary:</h3>
                        <p>{summary}</p>
                    </div>
                    )}
                </div>
                {/* Preview */}
                <div className='w-full md:w-1/2 p-4 overflow-auto bg-gray-50 dark:bg-zinc-800'>
                    <div className='prose dark:prose-invert max-w-none'>
                        <ReactMarkdown>{markdown}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarkdownEditor;