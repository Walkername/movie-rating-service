import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./admin-tool-bar.css";

const ADMIN_TOOLS = [
    {
        name: "Users",
        path: "./users-tool",
        className: "admin-toolbar__button--users",
    },
    {
        name: "Movies",
        path: "./movies-tool",
        className: "admin-toolbar__button--movies",
    },
    {
        name: "Posts",
        path: "./posts-tool",
        className: "admin-toolbar__button--posts",
    },
    {
        name: "Support",
        path: "./support",
        className: "admin-toolbar__button--support"
    }
];

export default function AdminToolBar() {
    const location = useLocation();
    const currentTool = computeCurrentTool(location);
    
    const [activeTool, setActiveTool] = useState(currentTool);

    const navigate = useNavigate();

    const handleNavigate = (tool) => {
        setActiveTool(tool);
        navigate(tool.path);
    };

    return (
        <div className="admin-toolbar">
            <div className="admin-toolbar__container">
                {ADMIN_TOOLS.map((tool, index) => (
                    <button
                        key={index}
                        onClick={() => handleNavigate(tool)}
                        className={`admin-toolbar__button ${tool.className} ${
                            activeTool.name === tool.name
                                ? "admin-toolbar__button--active"
                                : ""
                        }`}
                        aria-current={
                            activeTool.name === tool.name ? "page" : undefined
                        }
                    >
                        <span className="admin-toolbar__button-text">
                            {tool.name}
                        </span>
                        {activeTool.name === tool.name && (
                            <span className="admin-toolbar__button-indicator" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

function computeCurrentTool(location) {
    const currentPath = "./" + location.pathname.split("/").filter(Boolean).at(-1);
    let currentTool = ADMIN_TOOLS.find(tool => tool.path === currentPath);
    currentTool = currentTool === undefined ? ADMIN_TOOLS[0] : currentTool;
    
    return currentTool;
}