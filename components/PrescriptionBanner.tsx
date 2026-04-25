export default function PrescriptionBanner() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="bg-brand rounded-[--radius-xl] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-black leading-tight">Have a Prescription? <br /> Upload it in seconds.</h2>
                    <p className="text-white/80 max-w-md">Our licensed pharmacists will review your order and get your medication ready for same-day delivery.</p>
                </div>

                <div className="relative z-10">
                    <label className="cursor-pointer bg-white text-brand px-10 py-5 rounded-2xl font-black shadow-xl hover:bg-zinc-100 transition-colors inline-block">
                        Choose File
                        <input type="file" className="hidden" />
                    </label>
                </div>

                {/* Decorative background circle */}
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-dark opacity-10 rounded-full" />
            </div>
        </div>
    );
}