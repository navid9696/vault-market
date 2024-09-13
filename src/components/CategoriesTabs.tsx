import { useEffect, useReducer } from 'react'
import { Tabs } from '@mui/material'
import CategoryBtn from './CategoryBtn'
import { categoriesData } from '~/data/categories'
import { categoriesReducer, initialState, setActiveCategory, setActiveSubCategory } from '~/reducers/categoriesReducer'
import useStore from '~/store/useStore'

const CategoriesTabs = () => {
	const [state, dispatch] = useReducer(categoriesReducer, initialState)
	const { setReducerState } = useStore()

	useEffect(() => {
		setReducerState({
			activeCategory: state.activeCategory,
			activeSubCategory: state.activeSubCategory,
		})
	}, [state, setReducerState])

	const scrollToSection = () => {
		const section = document.getElementById('products-browsing')
		const navbarHeight = document.querySelector('nav')?.offsetHeight || 0

		if (section) {
			const sectionPosition = section.getBoundingClientRect().top + window.scrollY
			const scrollToPosition = sectionPosition - navbarHeight

			window.scrollTo({
				top: scrollToPosition,
				behavior: 'smooth',
			})
		}
	}

	return (
		<div className='relative w-full '>
			<div className=' flex items-center justify-center '>
				<Tabs
					className='text-green-500 w-fit '
					TabScrollButtonProps={{ sx: { marginTop: '-20px' } }}
					value={false}
					allowScrollButtonsMobile
					variant='scrollable'
					scrollButtons='auto'
					aria-label='scrollable auto tabs'>
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
					aria-label='scrollable auto tabs'>
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
