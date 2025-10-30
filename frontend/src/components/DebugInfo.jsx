// import React from 'react';

// const DebugInfo = () => {
//     const projectId = import.meta?.env?.VITE_WC_PROJECT_ID;
//     const origin = typeof window !== 'undefined' && window.location ? window.location.origin : '';

//     return (
//         <div className="p-4 bg-gray-100 rounded-lg text-sm">
//             <h3 className="font-semibold mb-2">Debug Information</h3>
//             <div className="space-y-1">
//                 <p><strong>Origin:</strong> {origin}</p>
//                 <p><strong>Project ID:</strong> {projectId ? `${projectId.substring(0, 8)}...` : 'NOT SET'}</p>
//                 <p><strong>Environment:</strong> {import.meta?.env?.MODE || 'unknown'}</p>
//                 <p><strong>HashConnect Available:</strong> {typeof window !== 'undefined' && window.hashconnect ? 'Yes' : 'No'}</p>
//             </div>
//             {!projectId && (
//                 <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700">
//                     <strong>⚠️ Missing Project ID!</strong><br/>
//                     Set VITE_WC_PROJECT_ID in your .env file
//                 </div>
//             )}
//         </div>
//     );
// };

// export default DebugInfo;

