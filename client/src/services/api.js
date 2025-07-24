const API_BASE = "http://localhost:5000/api/notes";

export const saveNote = async(content) => {
    const res = await fetch(API_BASE,{
        method: "POST",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify({content}),
    });
    const data = await res.json();
    return data;
};

export const getNotes = async () => {
    const res = await fetch(API_BASE);
    return await res.json();
};

export const summarizeNote = async (content) => {
    const res = await fetch("http://localhost:5000/api/ai", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({content}),
    });
    return await res.json();
};