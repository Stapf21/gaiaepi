import ApplicationLogo from '@/Components/ApplicationLogo';
import LoginBackground from '@/Components/LoginBackground';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function GuestLayout({ children, variant = 'default' }) {
    const { branding } = usePage().props;
    const hasBackground = Boolean(branding?.login_background_url);
    const logoUrl = branding?.logo_url ?? null;
    const overlayGif = branding?.login_overlay_gif_url ?? null;
    const [showOverlayGif, setShowOverlayGif] = useState(Boolean(overlayGif));

    useEffect(() => {
        setShowOverlayGif(Boolean(overlayGif));
    }, [overlayGif]);

    const logo = (
        <div className="flex justify-center">
            <Link href="/" className="inline-flex items-center justify-center">
                {logoUrl ? (
                    <img
                        src={logoUrl}
                        alt="Logo"
                        className={hasBackground
                            ? 'h-24 w-auto max-w-[320px] object-contain drop-shadow-lg'
                            : 'h-20 w-auto max-w-[300px] object-contain'}
                    />
                ) : (
                    <ApplicationLogo
                        className={hasBackground
                            ? 'h-20 w-20 fill-white drop-shadow-lg'
                            : 'h-20 w-20 fill-current text-gray-500'}
                    />
                )}
            </Link>
        </div>
    );

    if (variant === 'split') {
        const backgroundImage = branding?.login_background_url ?? null;

        return (
            <div className="min-h-screen w-full bg-slate-900">
                <div className="grid min-h-screen w-full md:grid-cols-[480px_1fr]">
                    <aside className="relative flex flex-col justify-between bg-gradient-to-b from-slate-950 to-slate-900 p-8 sm:p-10">
                        <div className="space-y-8">
                            {logo}
                            <div className="space-y-1 text-white">
                                <h1 className="text-3xl font-semibold tracking-tight">Faça seu login</h1>
                                <p className="text-sm text-slate-300">Acesse o sistema para gerenciar EPIs e equipe.</p>
                            </div>

                            <div className="rounded-2xl border border-white/20 bg-white/95 p-6 shadow-xl backdrop-blur">
                                {children}
                            </div>
                        </div>

                        <p className="text-xs text-slate-400">Gaia EPI</p>
                    </aside>

                    <section className="relative hidden md:block">
                        {backgroundImage ? (
                            <img
                                src={backgroundImage}
                                alt="Fundo"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
                        )}
                        <div className="absolute inset-0 bg-slate-950/40" />

                        {overlayGif && showOverlayGif && (
                            <img
                                src={overlayGif}
                                alt=""
                                onError={() => setShowOverlayGif(false)}
                                className="pointer-events-none absolute bottom-4 right-4 z-10 h-28 w-28 rounded-lg object-cover opacity-80 sm:h-32 sm:w-32"
                            />
                        )}
                    </section>
                </div>
            </div>
        );
    }

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
