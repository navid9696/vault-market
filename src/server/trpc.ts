import { initTRPC } from '@trpc/server'
import { Context } from '~/context/sessionsContext'

const trpc = initTRPC.context<Context>().create()

export const router = trpc.router
export const procedure = trpc.procedure
