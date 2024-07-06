import React from 'react'

const Header = () => {
	return (
		<header className="sticky h-3/4 bg-[url('/imgs/header.png')] bg-scroll bg-center bg-no-repeat bg-cover z-[-50]">
			<div className='h-full w-full flex items-end'>
				<p className='ml-5 md:ml-20 mb-20 text-3xl text-white'>
					Lorem ipsum <br /> dolor sit amet.
				</p>
			</div>
		</header>
	)
}

export default Header
