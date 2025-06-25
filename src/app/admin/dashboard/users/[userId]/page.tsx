import UserCapsDetails from '~/components/UserCapsDetails'

type PageProps = {
	params: Promise<{ userId: string }>
}

export default async function UserPage({ params }: PageProps) {
	const { userId } = await params
	return (
		<main className='p-6 bg-white min-h-screen'>
			<h1 className='text-2xl font-semibold mb-4'>Caps Orders for {userId}</h1>
			<UserCapsDetails userId={userId} />
		</main>
	)
}
