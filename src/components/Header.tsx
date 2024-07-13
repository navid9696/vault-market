import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { adSlogans } from '~/data/adSlogans'

const Header = () => {
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
	return (
		<>
			<header className=" h-3/4 bg-[url('/imgs/header.png')] bg-scroll bg-center bg-no-repeat bg-cover -z-10">
				<div className='relative w-full h-full '>
					<Slider
						className='absolute px-10 w-1/2 h-1/3 top-3/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-xl lg:text-2xl text-white'
						{...settings}>
						{adSlogans.map(slogan => (
							<div key={slogan}>{slogan}</div>
						))}
					</Slider>
				</div>
			</header>
		</>
	)
}

export default Header
