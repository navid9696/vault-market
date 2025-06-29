import UserOrdersDetails from '~/components/UserOrdersDetails'

type PageProps = {
	params: Promise<{ userId: string }>
}

const OrdersPage = async ({ params }: PageProps) => {
	const { userId } = await params

	return (
		<main className='p-6 bg-white'>
			<h1 className='text-2xl font-semibold mb-4'>Product Orders for {userId}</h1>
			<UserOrdersDetails userId={userId} />
		</main>
	)
}

export default OrdersPage
