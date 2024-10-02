import { useEffect, useReducer, useRef } from 'react'
import { Tabs } from '@mui/material'
import CategoryBtn from './CategoryBtn'
import { categoriesData } from '~/data/categories'
import { categoriesReducer, initialState, setActiveCategory, setActiveSubCategory } from '~/reducers/categoriesReducer'
import useStore from '~/store/useStore'

const CategoriesTabs = () => {
	const [state, dispatch] = useReducer(categoriesReducer, initialState)
	const { setReducerState } = useStore()
	const navbarRef = useRef(null)
	const sectionRef = useRef(null)

	useEffect(() => {
		setReducerState({
			activeCategory: state.activeCategory,
			activeSubCategory: state.activeSubCategory,
		})
	}, [state, setReducerState])

	const scrollToSection = () => {
		if (sectionRef.current && navbarRef.current) {
			const navbarHeight = (navbarRef.current as HTMLElement).offsetHeight
			const sectionPosition = (sectionRef.current as HTMLElement).getBoundingClientRect().top + window.scrollY
			window.scrollTo({
				top: sectionPosition - navbarHeight,
				behavior: 'smooth',
			})
		}
	}

	return (
		<div ref={sectionRef} id='products-browsing' className='relative w-full '>
			<div className=' flex items-center justify-center '>
				<Tabs
					className='text-green-500 w-fit '
					TabScrollButtonProps={{ sx: { marginTop: '-20px' } }}
					value={false}
					allowScrollButtonsMobile
					variant='scrollable'
					scrollButtons='auto'
					aria-label='Category list'>
					{categoriesData.categories.map(category => (
						<CategoryBtn
							key={category.id}
							text={category.name}
							onClick={() => {
								scrollToSection()
								dispatch(setActiveCategory({ activeCategory: category.id, activeSubCategory: 0 }))
							}}
							isActive={state.activeCategory === category.id}
						/>
					))}
				</Tabs>
			</div>
			<div className='absolute w-full h-[2px] left-0 bottom-[45px] bg-green-500 z-10 '></div>

			<div className=' -mt-6 text-center'>
				<Tabs
					className='text-green-500'
					value={false}
					allowScrollButtonsMobile
					variant='scrollable'
					scrollButtons='auto'
					aria-label='Category list'>
					{state.activeCategory !== null &&
						categoriesData.categories[state.activeCategory].subCategories.map(subCategory => (
							<CategoryBtn
								key={subCategory.id}
								isSubCategory={true}
								text={subCategory.name}
								onClick={() => {
									scrollToSection()
									dispatch(setActiveSubCategory({ activeSubCategory: subCategory.id }))
								}}
								isActive={state.activeSubCategory === subCategory.id}
							/>
						))}
				</Tabs>
			</div>
		</div>
	)
}

export default CategoriesTabs
