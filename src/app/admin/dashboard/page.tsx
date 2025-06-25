import AdminUsersTable from "~/components/AdminUsersTable"

const Dashboard = () => {
	return (
		<main className='p-6 bg-white min-h-screen'>
			<h1 className='text-2xl font-semibold mb-4'>Admin Dashboard</h1>
			<AdminUsersTable />
		</main>
	)
}

export default Dashboard
