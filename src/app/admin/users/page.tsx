import AdminUsersTable from '~/components/AdminUsersTable'

const UsersList = () => {
	return (
		<main className='p-6 bg-white'>
			<h1 className='text-2xl font-semibold mb-4'>Users List</h1>
			<AdminUsersTable />
		</main>
	)
}

export default UsersList
