import { capsOrderRouter } from './routers/capsOrderRouter'
import { favoriteRouter } from './routers/favouriteRouter'
import { productRouter } from './routers/productRouter'
import { userCartRouter } from './routers/userCartRouter'
import { userRouter } from './routers/userRouter'
import { router } from './trpc'

export const appRouter = router({
	product: productRouter,
	user: userRouter,
	favorite: favoriteRouter,
	exchange: capsOrderRouter,
	cart: userCartRouter,
})

export type AppRouter = typeof appRouter
