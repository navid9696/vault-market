// components/AdminNavbar.tsx
'use client'
import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import Image from 'next/image'
import Link from 'next/link'
import LogoutIcon from '@mui/icons-material/Logout'
import { signOut } from 'next-auth/react'

const pages = [
	{ label: 'Dashboard', href: '/admin/dashboard' },
	{ label: 'Products', href: '/admin/products' },
	{ label: 'Users', href: '/admin/users' },
]

export default function AdminNavbar() {
	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)

	const handleOpenNavMenu = (e: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(e.currentTarget)
	}
	const handleCloseNavMenu = () => {
		setAnchorElNav(null)
	}

	return (
		<AppBar component='nav' position='fixed'>
			<Container maxWidth='xl'>
				<Toolbar disableGutters>
					<Box sx={{ mr: 2 }}>
						<Link href='/admin/dashboard'>
							<Image src='/imgs/vaultboy-ok.png' alt='Vault Market' width={50} height={50} />
						</Link>
					</Box>
					<Typography
						component={Link}
						href='/admin/dashboard'
						variant='h6'
						noWrap
						sx={{
							mr: 2,
							display: { xs: 'none', md: 'flex' },
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.2rem',
							color: 'inherit',
							textDecoration: 'none',
						}}>
						Vault Market
					</Typography>

					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton size='large' onClick={handleOpenNavMenu} color='inherit'>
							<MenuIcon />
						</IconButton>
						<Menu
							anchorEl={anchorElNav}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
							transformOrigin={{ vertical: 'top', horizontal: 'left' }}
							sx={{ display: { xs: 'block', md: 'none' } }}>
							{pages.map(page => (
								<MenuItem key={page.href} onClick={handleCloseNavMenu}>
									<Link href={page.href}>
										<Typography textAlign='center'>{page.label}</Typography>
									</Link>
								</MenuItem>
							))}
						</Menu>
					</Box>

					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
						{pages.map(page => (
							<Button
								key={page.href}
								component={Link}
								href={page.href}
								sx={{ color: 'white', display: 'block', mr: 2 }}>
								{page.label}
							</Button>
						))}
					</Box>

					<Box sx={{ flexGrow: 0 }}>
						<Button onClick={() => signOut()} color='inherit'>
							<LogoutIcon />
							<Typography sx={{ ml: 1 }}>Logout</Typography>
						</Button>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	)
}
