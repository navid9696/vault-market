'use client'
import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpLink, loggerLink } from '@trpc/client'
import { trpc } from '~/server/client'

export const TrpcProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink(),                
        httpLink({ url: '/api/trpc' }), 
      ],
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </trpc.Provider>
    </QueryClientProvider>
  )
}
