export default function AccessibilityPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-16">
            <h1 className="text-4xl font-bold mb-6">Accessibility Statement</h1>
            <p className="text-zinc-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-6">
                <section>
                    <h2 className="text-2xl font-bold mb-3">Our Commitment</h2>
                    <p>We are committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying relevant accessibility standards.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-3">Accessibility Features</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Screen reader compatible</li>
                        <li>Keyboard navigation support</li>
                        <li>High contrast mode</li>
                        <li>Text resizing capabilities</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-3">Contact Us</h2>
                    <p>If you experience any difficulty accessing our website, please contact us at accessibility@aurapharma.com or call +1 (888) 555-0123.</p>
                </section>
            </div>
        </div>
    );
}