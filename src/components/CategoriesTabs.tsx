import { Tabs } from '@mui/material'
import CategoryBtn from './CategoryBtn'
import { categoriesData } from '@/data/categories'

interface CategoriesTabsProps {
	activeCategory: number | null
	setActiveCategory: React.Dispatch<React.SetStateAction<number | null>>
	activeSubCategory: number | null
	setActiveSubCategory: React.Dispatch<React.SetStateAction<number | null>>
}

const CategoriesTabs = ({
	activeCategory,
	setActiveCategory,
	activeSubCategory,
	setActiveSubCategory,
}: CategoriesTabsProps) => {
	return (
		<>
			<div className='flex items-center justify-center '>
				<Tabs
					className='text-green-500'
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
								setActiveSubCategory(null)
							}}
							isActive={activeCategory === category.id}
						/>
					))}
				</Tabs>
			</div>
			<div className='-mt-7 text-center '>
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
			</div>
		</>
	)
}

export default CategoriesTabs
