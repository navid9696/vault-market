'use client'

import React, { PropsWithChildren, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { trpc } from '~/server/client'

export const TrpcProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [queryClient] = useState<QueryClient>(() => new QueryClient())
	const [trpcClient] = useState<ReturnType<typeof trpc.createClient>>(() =>
		trpc.createClient({
			links: [
				httpBatchLink({
					url: '/api/trpc',
				}),
			],
		})
	)

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	)
}
