import { createClient } from "@/lib/supabase";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const next = requestUrl.searchParams.get("next") ?? "/";

    if (code) {
        const supabase = createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Redirect to the requested page or home
            return NextResponse.redirect(new URL(next, requestUrl.origin));
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(new URL("/auth/auth-code-error", requestUrl.origin));
}