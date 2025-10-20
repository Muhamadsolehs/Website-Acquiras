import React from "react";
import LoadingIcon from "@/components/Base/LoadingIcon";

interface LoadingCardProps {
    icon?: "circles" | "dots" | "spinner";
    text?: string;
    size?: number;
}

const Main: React.FC<LoadingCardProps> = ({
    text = "Loading...",
    size = 8,
}) => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl animate-fade-in">
                <LoadingIcon icon="circles" className={`w-${size} h-${size}`} />
                <div className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300 text-center">
                    {text}
                </div>
            </div>
        </div>
    );
};

export default Main;
