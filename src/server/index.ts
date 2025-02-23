import { productRouter } from './routers/productRouter'
import { userRouter } from './routers/userRouter'
import { router } from './trpc'

export const appRouter = router({
	product: productRouter,
	user: userRouter,
})

export type AppRouter = typeof appRouter
