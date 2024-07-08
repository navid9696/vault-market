import { Tabs } from '@mui/material'
import CategoryBtn from './CategoryBtn'
import { categoriesData } from '~/data/categories'
import { useState } from 'react'

const CategoriesTabs = () => {
	const [activeCategory, setActiveCategory] = useState<null | number>(0)
	const [activeSubCategory, setActiveSubCategory] = useState<null | number>(null)
	return (
		<>
			<div className='flex items-center justify-center '>
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
							onClick={() => {
								setActiveCategory(category.id)
								setActiveSubCategory(0)
							}}
							isActive={activeCategory === category.id}
						/>
					))}
				</Tabs>
			</div>
			<div className='-mt-6 text-center '>
				<Tabs
					className='text-green-500'
					value={false}
					allowScrollButtonsMobile
					variant='scrollable'
					scrollButtons='auto'
					aria-label='scrollable auto tabs'>
					{activeCategory !== null &&
						categoriesData.categories[activeCategory].subCategories.map(subCategory => (
							<CategoryBtn
								key={subCategory.id}
								isSubCategory={true}
								text={subCategory.name}
								onClick={() => setActiveSubCategory(subCategory.id)}
								isActive={activeSubCategory === subCategory.id}
							/>
						))}
				</Tabs>
			</div>
		</>
	)
}

export default CategoriesTabs
