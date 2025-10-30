// import React from "react";

// export default function WalletSelectModal({ open, onClose, onHashpack, onKabila }) {
//   if (!open) return null;
  
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div className="absolute inset-0 bg-black/40" onClick={onClose} />
//       <div className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-xl p-6">
//         <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Connect Your Wallet</h3>
//         <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 mb-6">
//           Choose a Hedera-compatible wallet to connect to AgriYield DApp.
//         </p>
        
//         <div className="space-y-3">
//           <button
//             onClick={onHashpack}
//             className="w-full flex items-center justify-between border dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-400"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
//                 <span className="text-white font-bold text-lg">H</span>
//               </div>
//               <div className="text-left">
//                 <div className="text-sm font-medium text-gray-900 dark:text-white">HashPack</div>
//                 <div className="text-xs text-gray-600 dark:text-gray-300">Most popular Hedera wallet</div>
//               </div>
//             </div>
//             <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
//               Recommended
//             </div>
//           </button>

//           <button
//             onClick={onKabila}
//             className="w-full flex items-center justify-between border dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:border-green-500 dark:hover:border-green-400"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
//                 <span className="text-white font-bold text-lg">K</span>
//               </div>
//               <div className="text-left">
//                 <div className="text-sm font-medium text-gray-900 dark:text-white">Kabila</div>
//                 <div className="text-xs text-gray-600 dark:text-gray-300">Mobile-first Hedera wallet</div>
//               </div>
//             </div>
//             <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
//               Mobile
//             </div>
//           </button>
//         </div>
        
//         <div className="mt-6 pt-4 border-t dark:border-gray-700">
//           <div className="flex justify-between items-center">
//             <p className="text-xs text-gray-500 dark:text-gray-400">
//               Secure connection via WalletConnect
//             </p>
//             <button 
//               onClick={onClose} 
//               className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
