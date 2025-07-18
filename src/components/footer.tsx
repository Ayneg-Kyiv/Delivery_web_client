import React from "react";

const Footer: React.FC = () => (
    <footer className="h-[5vh] bg-gray-800 text-white py-4 text-center">
        <div className="container mx-auto">
            <p className="text-sm">&copy; {new Date().getFullYear()} Take My Pack Dude. All rights reserved.</p>
        </div>
    </footer>
);

export default Footer;