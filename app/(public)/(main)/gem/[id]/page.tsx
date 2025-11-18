import GemDetail from "@reactcomponents/pages/GemDetail";

// This route is dynamic - gem IDs come from the API at runtime
// For static export, we try to fetch some real IDs at build time
// If API is unavailable, we return placeholders
// All gem IDs work via client-side routing (handled by .htaccess)
export const generateStaticParams = async () => {
  try {
    // Try to fetch some actual gem IDs from API at build time
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gems-backend-u.onrender.com/api';
    const response = await fetch(`${API_BASE_URL}/gems?limit=10&page=1`, {
      cache: 'no-store' // Don't cache during build
    });
    
    if (response.ok) {
      const data = await response.json();
      const gems = data.gems || data.data?.gems || [];
      if (gems.length > 0) {
        // Return actual gem IDs
        return gems.slice(0, 10).map((gem: { _id?: string; id?: string }) => ({
          id: gem._id || gem.id || 'placeholder'
        }));
      }
    }
  } catch (error) {
    // API not available at build time - use placeholders
    console.log('API not available at build time, using placeholders');
  }
  
  // Fallback: Return multiple placeholders if API is unavailable
  // The .htaccess file routes all /gem/* requests to index.html
  // Client-side Next.js router then handles the actual gem IDs
  return [
    { id: 'placeholder-1' },
    { id: 'placeholder-2' },
    { id: 'placeholder-3' }
  ];
};

export default function GemDetailPage() {
  return <GemDetail />;
}

