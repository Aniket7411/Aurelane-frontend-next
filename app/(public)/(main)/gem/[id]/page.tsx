import GemDetail from "@reactcomponents/pages/GemDetail";

// This route is dynamic - gem IDs come from the API at runtime
// For static export with Vercel, we need to generate a catch-all pattern
// All gem IDs work via client-side routing (React Router handles the actual routing)

// Generate static params for common gem IDs at build time
// This ensures some routes are pre-generated, but all IDs work via client-side routing
export const generateStaticParams = async () => {
  try {
    // Try to fetch some actual gem IDs from API at build time
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gems-backend-u.onrender.com/api';
    const response = await fetch(`${API_BASE_URL}/gems?limit=50&page=1`, {
      cache: 'no-store' // Don't cache during build
    });
    
    if (response.ok) {
      const data = await response.json();
      const gems = data.gems || data.data?.gems || [];
      if (gems.length > 0) {
        // Return actual gem IDs (increase limit for better coverage)
        return gems.map((gem: { _id?: string; id?: string }) => ({
          id: gem._id || gem.id || 'placeholder'
        }));
      }
    }
  } catch (error) {
    // API not available at build time - use placeholders
    console.log('API not available at build time, using placeholders');
  }
  
  // Fallback: Return placeholders if API is unavailable
  // Client-side React Router will handle all actual gem IDs
  return [
    { id: 'placeholder-1' },
    { id: 'placeholder-2' },
    { id: 'placeholder-3' }
  ];
};

// Note: With static export, dynamicParams doesn't work
// All routes are handled via client-side React Router

export default function GemDetailPage() {
  return <GemDetail />;
}

