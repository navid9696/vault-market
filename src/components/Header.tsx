import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { adSlogans } from '~/data/adSlogans'

const settings = {
	accessibility: false,
	adaptiveHeight: true,
	arrows: false,
	autoplaySpeed: 5000,
	infinite: true,
	speed: 1500,
	slidesToShow: 1,
	slidesToScroll: 1,
	autoplay: true,
}

const Header = () => {
	return (
		<>
			<header className="hue-rotate-30 dark:hue-rotate-0 h-2/3 sm:h-3/4 bg-[url('/imgs/header.png')] bg-scroll bg-center bg-no-repeat bg-cover -z-10">
				<div className='hidden sm:block relative w-full h-full '>
					<Slider
						draggable={false}
						className='absolute px-10 w-1/2 h-1/3 top-3/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-xl lg:text-2xl text-text'
						{...settings}>
						{adSlogans.map(slogan => (
							<p key={slogan}>{slogan}</p>
						))}
					</Slider>
				</div>
			</header>
		</>
	)
}

export default Header
