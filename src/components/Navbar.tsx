import Image from 'next/image'
import ShoppingCart from '@mui/icons-material/ShoppingCartTwoTone'
import Link from 'next/link'
import AccountMenu from './AccountMenu'
import { Badge } from '@mui/material'
import { useState } from 'react'

import CategoriesTabs from './CategoriesTabs'

const Navbar = () => {
	const [activeCategory, setActiveCategory] = useState<null | number>(0)
	const [activeSubCategory, setActiveSubCategory] = useState<null | number>(null)

	return (
		<div className='sticky top-0 '>
			<nav className='mx-auto max-w-screen-md'>
				<div className='p-2 flex items-center justify-between h-12 border-2 border-green-600 bg-gradient-to-r from-green-950 via-green-900 to-green-950  md:rounded-full z-10'>
					<div className='flex items-center '>
						<div>
							<Link href={'/'}>
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
							<span className='ml-2 text-green-500 font-extrabold text-lg'>1500</span>
						</div>
					</div>
					<div className='flex items-center'>
						<Link className='mr-3' href={'/cart'}>
							<Badge badgeContent={5} color='warning'>
								<ShoppingCart className='text-green-600' />
							</Badge>
						</Link>
						<AccountMenu />
					</div>
				</div>
				<div>
					<CategoriesTabs
						activeCategory={activeCategory}
						setActiveCategory={setActiveCategory}
						activeSubCategory={activeSubCategory}
						setActiveSubCategory={setActiveSubCategory}
					/>
				</div>
			</nav>
			<div className='absolute hidden lg:block inset-0 bg-green-600 w-[900px] h-2 top-1 mx-auto rounded-full -z-10'></div>
			<div className='absolute hidden lg:block inset-0 bg-green-600 w-[1000px] h-2 top-5 mx-auto rounded-full -z-10'></div>
			<div className='absolute hidden lg:block inset-0 bg-green-600 w-[900px] h-2 top-9 mx-auto rounded-full -z-10'></div>
		</div>
	)
}

export default Navbar
