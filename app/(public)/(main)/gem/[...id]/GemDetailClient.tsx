'use client';

import GemDetail from "@reactcomponents/pages/GemDetail";

// Client component wrapper for GemDetail
// This is needed because generateStaticParams must be in a server component
export default function GemDetailClient() {
    return <GemDetail />;
}

