'use client'

import { useEffect, useReducer, useRef } from 'react'
import { Tabs } from '@mui/material'
import CategoryBtn from './CategoryBtn'
import { categoriesData } from '~/data/categories'
import { categoriesReducer, initialState, setActiveCategory, setActiveSubCategory } from '~/reducers/categoriesReducer'
import useStore from '~/store/useStore'

interface CategoriesTabs {
	scrollToSection: () => void
}

const CategoriesTabs = ({ scrollToSection }: CategoriesTabs) => {
	const [state, dispatch] = useReducer(categoriesReducer, initialState)
	const { changeCategory, changeSubCategory } = useStore()

	useEffect(() => {
		changeCategory(state.activeCategory)
		changeSubCategory(state.activeSubCategory)
	}, [state, changeCategory, changeSubCategory])

	return (
		<div id='products-browsing' className='relative w-full '>
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
