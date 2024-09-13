import { useReducer } from 'react'
import { Tabs } from '@mui/material'
import CategoryBtn from './CategoryBtn'
import { categoriesData } from '~/data/categories'
import { categoriesReducer, initialState, setActiveCategory, setActiveSubCategory } from '~/reducers/categoriesReducer'

const CategoriesTabs = () => {
	const [state, dispatch] = useReducer(categoriesReducer, initialState)

	return (
		<>
			<div className='flex items-center justify-center'>
				<Tabs
					className='text-green-500'
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
							onClick={() => dispatch(setActiveCategory({ activeCategory: category.id, activeSubCategory: 0 }))}
							isActive={state.activeCategory === category.id}
						/>
					))}
				</Tabs>
			</div>

			<div className='-mt-6 text-center'>

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
								onClick={() => dispatch(setActiveSubCategory({ activeSubCategory: subCategory.id }))}
								isActive={state.activeSubCategory === subCategory.id}
							/>
						))}
				</Tabs>
			</div>
		</>
	)
}

export default CategoriesTabs
