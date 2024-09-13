import { createAction, createReducer, ActionType } from 'typesafe-actions'

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
	activeSubCategory: number
}

const initialState: State = {
	activeCategory: 0,
	activeSubCategory: 0,
}

const categoriesReducer = createReducer<State, CategoriesAction>(initialState)
	.handleAction(setActiveCategory, (state, action) => ({
		...state,
		activeCategory: action.payload.activeCategory,
		activeSubCategory: action.payload.activeSubCategory,
	}))
	.handleAction(setActiveSubCategory, (state, action) => ({
		...state,
		activeSubCategory: action.payload.activeSubCategory,
	}))

export { setActiveCategory, setActiveSubCategory, categoriesReducer, initialState }
