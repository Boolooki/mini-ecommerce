import React from "react";

const Footer: React.FC = () => {
    const year = new Date().getFullYear();

    return (
        <footer
            aria-label="Site footer"
            className="border-t border-gray-200 py-3 px-4 text-center text-sm text-gray-600 bg-orange-50"
        >
            <div>
                © {year}{" "}
                <a
                    href="https://sansevieria.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:underline"
                >
                    sansevieria.co
                </a>
                . All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
