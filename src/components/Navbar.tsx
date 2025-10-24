import Image from 'next/image'
import ShoppingCart from '@mui/icons-material/ShoppingCartTwoTone'
import Link from 'next/link'
import AccountMenu from './AccountMenu'
import { Badge, styled } from '@mui/material'
import { useNavigationHeight } from '~/context/NavbarHeightContext'
import { trpc } from '~/server/client'
import { useSession } from 'next-auth/react'
import TransitionsModal from './TransitionModal'
import { useCallback, useEffect, useRef, useState } from 'react'
import CartModal from './CartModal'
import { useTheme as useNextTheme } from 'next-themes'
import { Switch } from '@mui/material'
import { GiBottleCap } from 'react-icons/gi'
import { clearGuestId, ensureGuestId, getGuestId } from '~/lib/guestId'
import ExchangeModal from './ExchangeModal'

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
	width: 62,
	height: 34,
	padding: 7,
	'& .MuiSwitch-switchBase': {
		margin: 1,
		padding: 0,
		transform: 'translateX(6px)',
		'&.Mui-checked': {
			color: '#fff',
			transform: 'translateX(22px)',
			'& .MuiSwitch-thumb:before': {
				backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
					'#fff'
				)}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
			},
			'& + .MuiSwitch-track': {
				opacity: 1,
				backgroundColor: '#aab4be',
				...theme.applyStyles('dark', {
					backgroundColor: 'var(--primary)',
				}),
			},
		},
	},
	'& .MuiSwitch-thumb': {
		backgroundColor: 'var(--surface)',
		width: 32,
		height: 32,
		'&::before': {
			content: "''",
			position: 'absolute',
			width: '100%',
			height: '100%',
			left: 0,
			top: 0,
			backgroundRepeat: 'no-repeat',
			backgroundPosition: 'center',
			backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
				'#fff'
			)}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
		},
		...theme.applyStyles('dark', {
			backgroundColor: 'var(--surface)',
		}),
	},
	'& .MuiSwitch-track': {
		opacity: 1,
		backgroundColor: '#aab4be',
		borderRadius: 20 / 2,
		...theme.applyStyles('dark', {
			backgroundColor: '#8796A5',
		}),
	},
}))

const Navbar = () => {
	const { theme, setTheme } = useNextTheme()
	const { navRef } = useNavigationHeight()
	const { data: session, status } = useSession()
	const [modalOpen, setModalOpen] = useState(false)
	const utils = trpc.useUtils()
	const calledRef = useRef(false)
	const [gid, setGid] = useState('')
	const [contentId, setContentId] = useState<string | null>(null)
	const { data: caps } = trpc.exchange.getCapsBalance.useQuery(undefined, { enabled: !!session })
	const { data: cart } = trpc.cart.getTotalItems.useQuery(undefined, { enabled: !!session })

	useEffect(() => setGid(ensureGuestId()), [])

	const merge = trpc.cart.mergeGuestCart.useMutation({
		onSuccess: async () => {
			clearGuestId()
			await utils.cart.getCartItems.invalidate()
			await utils.cart.getTotalItems.invalidate()
		},
		onSettled: () => {
			calledRef.current = true
		},
	})

	const handleModalClose = useCallback(() => {
		setModalOpen(false)
	}, [setModalOpen])

	const handleModalOpen = useCallback(() => {
		setModalOpen(true)
	}, [setModalOpen])

	const cartUser = trpc.cart.getTotalItems.useQuery(undefined, {
		enabled: status === 'authenticated',
		refetchOnWindowFocus: false,
	})

	const cartGuest = trpc.cart.getTotalItems.useQuery(
		{ gid },
		{
			enabled: status !== 'authenticated' && !!gid,
			refetchOnWindowFocus: false,
		}
	)

	const cartCount = cart?.total ?? (status !== 'authenticated' ? cartGuest.data?.total ?? 0 : cartUser.data?.total ?? 0)
	const totalCaps = caps?.balance ?? 0

	const renderModalContent = () => {
		switch (contentId) {
			case 'exchange':
				return <ExchangeModal onClose={handleModalClose} />
			case 'cart':
				return <CartModal />
			default:
				return null
		}
	}

	const [mounted, setMounted] = useState(false)
	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		if (status === 'authenticated' && !calledRef.current && !merge.isPending) {
			const gid = getGuestId()
			if (gid) merge.mutate({ gid })
			else calledRef.current = true
		}
	}, [status, merge.isPending, merge])

	return (
		<>
			<nav className='fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full md:max-w-screen-md '>
				<div ref={navRef} className=' '>
					<div className='p-2 flex items-center justify-between h-14 border-2 border-border bg-gradient-to-r from-bg via-surface to-bg  md:rounded-full z-10'>
						<div className='flex items-center '>
							<div>
								<Link href='/#top'>
									<Image
										src='/imgs/logo2.png'
										width={40}
										height={40}
										alt='logo with vault boy'
										className='filter dark:hue-rotate-[-75deg]'
									/>
								</Link>
							</div>
							<div
								onClick={() => {
									setContentId('exchange')
									handleModalOpen()
								}}
								className='ml-7 flex items-center cursor-pointer'>
								<GiBottleCap />
								<span className='ml-2 text-text font-extrabold text-lg'>{totalCaps}</span>
							</div>
						</div>
						<div className='flex items-center'>
							{mounted && (
								<MaterialUISwitch
									checked={theme === 'dark'}
									onChange={(_, checked) => setTheme(checked ? 'dark' : 'light')}
								/>
							)}
							<div
								className='p-2 cursor-pointer'
								onClick={() => {
									setContentId('cart')
									handleModalOpen()
								}}>
								<Badge badgeContent={cartCount} color='warning' max={99}>
									<ShoppingCart className=' text-text' />
								</Badge>
							</div>
							<AccountMenu />
						</div>
					</div>
				</div>
				<div className='absolute hidden lg:block inset-0 bg-border w-[900px] h-2 top-1 left-1/2 -translate-x-1/2 rounded-full -z-10'></div>
				<div className='absolute hidden lg:block inset-0 bg-border w-[1000px] h-2 top-6 left-1/2 -translate-x-1/2 rounded-full -z-10'></div>
				<div className='absolute hidden lg:block inset-0 bg-border w-[900px] h-2 top-11 left-1/2 -translate-x-1/2 rounded-full -z-10'></div>
			</nav>
			<TransitionsModal open={modalOpen} handleClose={handleModalClose}>
				{renderModalContent()}
			</TransitionsModal>
		</>
	)
}

export default Navbar
