import { useMemo } from "react";

const buildBackgroundStyle = (branding) => {
    const image = branding?.login_background_url;
    if (!image) {
        return {};
    }

    return {
        backgroundImage: `url(${image})`,
    };
};

export default function LoginBackground({ branding, className = "", children }) {
    const style = useMemo(() => buildBackgroundStyle(branding), [branding]);

    return (
        <div
            className={`relative min-h-screen bg-cover bg-center bg-no-repeat ${className}`.trim()}
            style={style}
        >
            <div className="absolute inset-0 bg-slate-900/60" aria-hidden="true" />
            <div className="relative flex min-h-screen items-center justify-center px-4 sm:px-6">
                {children}
            </div>
        </div>
    );
}
