import { useReducer } from 'react'
import { Tabs } from '@mui/material'
import CategoryBtn from './CategoryBtn'
import { categoriesData } from '~/data/categories'
import { createAction, ActionType, getType } from 'typesafe-actions'

const setActiveCategory = createAction('SET_ACTIVE_CATEGORY')<{
	activeCategory: number
	activeSubCategory: number
}>()

const setActiveSubCategory = createAction('SET_ACTIVE_SUB_CATEGORY')<{
	activeSubCategory: number
}>()

const actions = { setActiveCategory, setActiveSubCategory }

type CategoriesAction = ActionType<typeof actions>

interface State {
	activeCategory: number
	activeSubCategory: number | null
}

const initialState: State = {
	activeCategory: 0,
	activeSubCategory: null,
}

const reducer = (state: State = initialState, action: CategoriesAction): State => {
	switch (action.type) {
		case getType(setActiveCategory):
			return {
				...state,
				activeCategory: action.payload.activeCategory,
				activeSubCategory: action.payload.activeSubCategory,
			}
		case getType(setActiveSubCategory):
			return {
				...state,
				activeSubCategory: action.payload.activeSubCategory,
			}
		default:
			return state
	}
}

const CategoriesTabs = () => {
	const [state, dispatch] = useReducer(reducer, initialState)

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
							onClick={() => {
								dispatch(setActiveCategory({ activeCategory: category.id, activeSubCategory: 0 }))
							}}
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
