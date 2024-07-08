import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

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
						<div>
							<h3>Limited Time Offer: Buy One Nuka-Cola, Get One Free!</h3>
						</div>
						<div>
							<h3>Discover the Latest in Energy Weapons Technology!</h3>
						</div>
						<div>
							<h3>Become a Brotherhood of Steel Member and Enjoy Free Repairs!</h3>
						</div>
						<div>
							<h3>Best Sellers: Shop Our Most Popular Rad-X and RadAway!</h3>
						</div>
						<div>
							<h3>Fast Delivery: Get Your Supplies Before the Next Radstorm!</h3>
						</div>
						<div>
							<h3>Stock Up on Fusion Cores and Keep Your Power Armor Running!</h3>
						</div>
					</Slider>
				</div>
			</header>
		</>
	)
}

export default Header
