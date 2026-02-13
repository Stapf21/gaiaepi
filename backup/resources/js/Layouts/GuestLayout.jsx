import ApplicationLogo from '@/Components/ApplicationLogo';
import LoginBackground from '@/Components/LoginBackground';
import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const { branding } = usePage().props;
    const hasBackground = Boolean(branding?.login_background_url);

    const logo = (
        <div className="flex justify-center">
            <Link href="/">
                <ApplicationLogo
                    className={hasBackground ? 'h-20 w-20 fill-white drop-shadow-lg' : 'h-20 w-20 fill-current text-gray-500'}
                />
            </Link>
        </div>
    );

    const cardClasses = hasBackground
        ? 'mt-6 w-full overflow-hidden bg-white/90 px-6 py-6 shadow-xl backdrop-blur-sm sm:max-w-md sm:rounded-xl'
        : 'mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg';

    const card = <div className={cardClasses}>{children}</div>;

    if (hasBackground) {
        return (
            <LoginBackground branding={branding}>
                <div className="w-full max-w-md space-y-6">
                    {logo}
                    {card}
                </div>
            </LoginBackground>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            {logo}
            {card}
        </div>
    );
}
