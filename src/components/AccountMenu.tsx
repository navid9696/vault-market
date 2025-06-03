'use client'

import { useEffect, useState } from 'react'
import { useTheme as useNextTheme } from 'next-themes'
import { useTheme as useMuiTheme } from '@mui/material/styles'
import dynamic from 'next/dynamic'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { Skeleton, Switch, Typography, useTheme } from '@mui/material'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchangeTwoTone'
import LogoutIcon from '@mui/icons-material/LogoutTwoTone'
import FavoriteIcon from '@mui/icons-material/FavoriteTwoTone'
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasketTwoTone'
import ContrastIcon from '@mui/icons-material/ContrastTwoTone'
import SettingsIcon from '@mui/icons-material/SettingsTwoTone'
import LoginIcon from '@mui/icons-material/Login'
import TransitionsModal from './TransitionModal'
import AccountSettings from './AccountSettings'
import { trpc } from '~/server/client'

const ExchangeModal = dynamic(() => import('./ExchangeModal'), {
	ssr: false,
	loading: () => (
		<>
			<Skeleton variant='text' height={150}>
				<Typography component={'h3'} variant='h3'>
					Caps&Cash Exchange
				</Typography>
			</Skeleton>
			<Skeleton variant='text' sx={{ fontSize: '3rem' }} />
			<Skeleton variant='rectangular' height={250} />
		</>
	),
})

export default function AccountMenu() {
	const { resolvedTheme, setTheme } = useNextTheme()
	const muiTheme = useTheme()
	const { data: session } = useSession()
	const [modalOpen, setModalOpen] = useState(false)
	const [contentId, setContentId] = useState<string | null>(null)
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)
	const { data: me } = trpc.user.getProfile.useQuery(undefined, { enabled: !!session })
	const rawImage = me?.image
	const userImage = rawImage ? (rawImage.startsWith('http') ? rawImage : window.location.origin + rawImage) : undefined

	const handleClick = (e: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const handleModalOpen = (id: string) => {
		setModalOpen(true)
		setContentId(id)
	}

	const handleModalClose = () => {
		setModalOpen(false)
	}

	const renderModalContent = () => {
		switch (contentId) {
			case 'exchange':
				return <ExchangeModal onClose={handleModalClose} />
			case 'profile':
				return <AccountSettings />
			default:
				return null
		}
	}

	return (
		<>
			<Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
				<Tooltip title='Account settings'>
					<IconButton
						onClick={handleClick}
						size='small'
						sx={{ ml: 2 }}
						aria-controls={open ? 'account-menu' : undefined}
						aria-haspopup='true'
						aria-expanded={open ? 'true' : undefined}>
						<Avatar src={userImage ?? undefined} sx={{ width: 32, height: 32 }}></Avatar>
					</IconButton>
				</Tooltip>
			</Box>
			<Menu
				anchorEl={anchorEl}
				id='account-menu'
				open={open}
				onClose={handleClose}
				slotProps={{
					paper: {
						elevation: 0,
						sx: {
							overflow: 'visible',
							filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							mt: 1.5,
							'& .MuiAvatar-root': {
								width: 32,
								height: 32,
								ml: -0.5,
								mr: 1,
							},
							'&::before': {
								content: '""',
								display: 'block',
								position: 'absolute',
								top: 0,
								right: 14,
								width: 10,
								height: 10,
								bgcolor: 'background.paper',
								transform: 'translateY(-50%) rotate(45deg)',
								zIndex: 0,
							},
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
				{session && [
					<MenuItem key='favorites' onClick={handleClose}>
						<Link href='/favorites'>
							<FavoriteIcon className='-ml-2 mr-2' fontSize='large' /> Favorites
						</Link>
					</MenuItem>,
					<MenuItem key='orders' onClick={handleClose}>
						<Link href='/userOrders'>
							<ShoppingBasketIcon className='-ml-2 mr-2' fontSize='large' /> Orders
						</Link>
					</MenuItem>,
					<MenuItem key='exchange' onClick={() => handleModalOpen('exchange')}>
						<CurrencyExchangeIcon className='-ml-2 mr-4' fontSize='large' /> Caps&Cash Exchange
					</MenuItem>,
					<Divider key='divider' />,
					<MenuItem key='profile' onClick={() => handleModalOpen('profile')}>
						<ListItemIcon>
							<SettingsIcon className='-ml-2 mr-2 text-text' fontSize='large' />
						</ListItemIcon>
						Profile Settings
					</MenuItem>,
				]}

				<MenuItem
					onClick={() => {
						setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
					}}>
					<ListItemIcon>
						<ContrastIcon className='-ml-2 mr-2 text-text' fontSize='large' />
					</ListItemIcon>
					<Switch
						checked={resolvedTheme === 'light'}
						onChange={(_, checked) => setTheme(checked ? 'light' : 'dark')}
						color='secondary'
						sx={{
							'& .MuiSwitch-switchBase.Mui-checked': {
								color: muiTheme.palette.secondary.main,
							},
							'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
								color: muiTheme.palette.secondary.main,
							},
						}}
					/>
				</MenuItem>

				{session ? (
					<MenuItem onClick={() => signOut({ callbackUrl: '/login' })}>
						<ListItemIcon>
							<LogoutIcon className='-ml-2 mr-2 text-text' fontSize='large' />
						</ListItemIcon>
						Sign Out
					</MenuItem>
				) : (
					<Link href={'/login'}>
						<MenuItem
							onClick={() => {
								handleClose
							}}>
							<ListItemIcon className='mr-2'>
								<LoginIcon className='text-text' fontSize='small' />
							</ListItemIcon>
							Sign In
						</MenuItem>
					</Link>
				)}
			</Menu>
			<TransitionsModal open={modalOpen} handleClose={handleModalClose}>
				{renderModalContent()}
			</TransitionsModal>
		</>
	)
}
