import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_TOOLS = [
    {
        name: "Users",
        path: "./users-tool"
    },
    {
        name: "Movies",
        path: "./movies-tool"
    },
    {
        name: "Posts",
        path: "./posts-tool"
    }
];

export default function AdminToolBar() {
    const [activeTool, setActiveTool] = useState(ADMIN_TOOLS[0]);
    
    const navigate = useNavigate();

    const handleNavigate = (tool) => {
        setActiveTool(tool);
        navigate(tool.path);
    }
    
    return (
        <div className="admin-toolbar">
            {
                ADMIN_TOOLS.map((tool, index) => (
                    <button
                        key={index}
                        onClick={() => handleNavigate(tool)}
                        disabled={activeTool.name === tool.name}
                    >{tool.name}</button>
                ))
            }
        </div>  
    );
}