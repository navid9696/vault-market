import Image from 'next/image'
import ShoppingCart from '@mui/icons-material/ShoppingCartTwoTone'
import Link from 'next/link'
import AccountMenu from './AccountMenu'
import { Badge } from '@mui/material'
import { useNavigationHeight } from '~/context/NavbarHeightContext'
import { trpc } from '~/server/client'
import { useSession } from 'next-auth/react'
import TransitionsModal from './TransitionModal'
import { useCallback, useState } from 'react'
import CartModal from './CartModal'

const Navbar = () => {
	const { navRef } = useNavigationHeight()
	const { data: session } = useSession()
	const { data: caps } = trpc.exchange.getCapsBalance.useQuery(undefined, { enabled: !!session })
	const { data: cart } = trpc.cart.getTotalItems.useQuery(undefined, { enabled: !!session })
	const [modalOpen, setModalOpen] = useState(false)
	const handleModalClose = useCallback(() => {
		setModalOpen(false)
	}, [setModalOpen])

	const handleModalOpen = useCallback(() => {
		setModalOpen(true)
	}, [setModalOpen])

	const totalCaps = caps?.balance ?? 0
	const cartCount = cart?.total

	return (
		<>
			<nav className='fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full md:max-w-screen-md '>
				<div ref={navRef} className=' '>
					<div className='p-2 flex items-center justify-between h-14 border-2 border-green-600 bg-gradient-to-r from-green-950 via-green-900 to-green-950  md:rounded-full z-10'>
						<div className='flex items-center '>
							<div>
								<Link href={'/#top'}>
									<Image src={'/imgs/logo.png'} width={50} height={50} alt='logo with vault boy' loading='lazy' />
								</Link>
							</div>
							<div className='ml-7 flex'>
								<Image
									className='object-contain'
									src={'/icons/nuka-cap-alt.png'}
									width={15}
									height={15}
									alt='nuka cola bottle cap'
									loading='lazy'
								/>
								<span className='ml-2 text-green-500 font-extrabold text-lg'>{totalCaps}</span>
							</div>
						</div>
						<div className='flex items-center'>
							<div className='p-2 cursor-pointer' onClick={handleModalOpen}>
								<Badge badgeContent={cartCount} color='warning' max={99}>
									<ShoppingCart className=' text-green-600' />
								</Badge>
							</div>
							<AccountMenu />
						</div>
					</div>
				</div>
				<div className='absolute hidden lg:block inset-0 bg-green-600 w-[900px] h-2 top-1 left-1/2 -translate-x-1/2 rounded-full -z-10'></div>
				<div className='absolute hidden lg:block inset-0 bg-green-600 w-[1000px] h-2 top-6 left-1/2 -translate-x-1/2 rounded-full -z-10'></div>
				<div className='absolute hidden lg:block inset-0 bg-green-600 w-[900px] h-2 top-11 left-1/2 -translate-x-1/2 rounded-full -z-10'></div>
			</nav>
			<TransitionsModal open={modalOpen} handleClose={handleModalClose}>
				<CartModal />
			</TransitionsModal>
		</>
	)
}

export default Navbar
