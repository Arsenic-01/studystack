"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

interface ReactQueryProviderProps {
  children: ReactNode;
}

export default function ReactQueryProvider({
  children,
}: ReactQueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// TODO: Uncomment the code below and remove the above code when you want to use the React Query Provider with persistence

// "use client";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { persistQueryClient } from "@tanstack/react-query-persist-client";
// import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
// import { ReactNode, useState, useEffect } from "react";

// interface ReactQueryProviderProps {
//   children: ReactNode;
//   loadingComponent?: ReactNode;
// }

// export default function ReactQueryProvider({
//   children,
//   loadingComponent = (
//     <div className="flex justify-center items-center h-screen">Loading...</div>
//   ),
// }: ReactQueryProviderProps) {
//   const [queryClient] = useState(
//     () =>
//       new QueryClient({
//         defaultOptions: {
//           queries: {
//             staleTime: 1000 * 60 * 5, // 5 minutes
//             refetchInterval: 1000 * 60 * 5, // 5 minutes
//             refetchOnWindowFocus: false,
//           },
//         },
//       })
//   );

//   const [isRestored, setIsRestored] = useState(false);

//   useEffect(() => {
//     if (typeof window === "undefined") {
//       setIsRestored(true);
//       return;
//     }

//     let persister: ReturnType<typeof createSyncStoragePersister>;

//     try {
//       persister = createSyncStoragePersister({
//         storage: window.localStorage,
//         key: "REACT_QUERY_OFFLINE_CACHE",
//         throttleTime: 1000,
//       });

//       const [unsubscribeFn] = persistQueryClient({
//         queryClient,
//         persister,
//         maxAge: 1000 * 60 * 60 * 24, // 24 hours
//         buster: process.env.NEXT_PUBLIC_APP_VERSION, // optional cache buster
//       });

//       setIsRestored(true);

//       return () => {
//         unsubscribeFn();
//       };
//     } catch (error) {
//       console.error("Error setting up query persister:", error);
//       setIsRestored(true); // Continue anyway without persistence
//     }
//   }, [queryClient]);

//   if (!isRestored) {
//     return loadingComponent;
//   }

//   return (
//     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//   );
// }
