import { Tabs } from '@mui/material'
import CategoryBtn from './CategoryBtn'
import { categoriesData } from '~/data/categories'
import { useReducer } from 'react'

enum ActionType {
	SET_ACTIVE_CATEGORY = 'SET_ACTIVE_CATEGORY',
	SET_ACTIVE_SUB_CATEGORY = 'SET_ACTIVE_SUB_CATEGORY',
}

interface Action {
	type: 'SET_ACTIVE_CATEGORY' | 'SET_ACTIVE_SUB_CATEGORY'
	payload: number
}
interface State {
	activeCategory: number
	activeSubCategory: number | null
}

const initialState = {
	activeCategory: 0,
	activeSubCategory: null,
}

const reducer = (state: State, action: Action): State => {
	const { type, payload } = action
	switch (type) {
		case ActionType.SET_ACTIVE_CATEGORY:
			return {
				...state,
				activeCategory: payload,
				activeSubCategory: 0,
			}
		case ActionType.SET_ACTIVE_SUB_CATEGORY:
			return {
				...state,
				activeSubCategory: payload,
			}

		default:
			return state
	}
}

const CategoriesTabs = () => {
	const [state, dispatch] = useReducer(reducer, initialState)

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
								dispatch({ type: 'SET_ACTIVE_CATEGORY', payload: category.id })
							}}
							isActive={state.activeCategory === category.id}
						/>
					))}
				</Tabs>
			</div>
			<div className='-mt-6 flex items-center justify-center'>
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
								onClick={() => dispatch({ type: 'SET_ACTIVE_SUB_CATEGORY', payload: subCategory.id })}
								isActive={state.activeSubCategory === subCategory.id}
							/>
						))}
				</Tabs>
			</div>
		</>
	)
}

export default CategoriesTabs
