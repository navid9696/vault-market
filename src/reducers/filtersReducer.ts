import { createAction, createReducer, ActionType } from 'typesafe-actions'

const setPriceFilter = createAction('SET_PRICE_FILTER')<number[]>()
const setOnSaleFilter = createAction('SET_ON_SALE_FILTER')<boolean>()
const setUnavailableFilter = createAction('SET_UNAVAILABLE_FILTER')<boolean>()
const setRatingFilter = createAction('SET_RATING_FILTER')<string | number>()

const actions = {
	setPriceFilter,
	setOnSaleFilter,
	setUnavailableFilter,
	setRatingFilter,
}

type FiltersAction = ActionType<typeof actions>

interface State {
	price: number[]
	checkedOnSale: boolean
	checkedShowedUnavailable: boolean
	checkedRating: string | number
}

const initialState: State = {
	price: [1, 9999],
	checkedOnSale: false,
	checkedShowedUnavailable: false,
	checkedRating: 'Any',
}

const filtersReducer = createReducer<State, FiltersAction>(initialState)
	.handleAction(setPriceFilter, (state, action) => ({
		...state,
		price: action.payload,
	}))
	.handleAction(setOnSaleFilter, (state, action) => ({
		...state,
		checkedOnSale: action.payload,
	}))
	.handleAction(setUnavailableFilter, (state, action) => ({
		...state,
		checkedShowedUnavailable: action.payload,
	}))
	.handleAction(setRatingFilter, (state, action) => ({
		...state,
		checkedRating: action.payload,
	}))

export { setPriceFilter, setOnSaleFilter, setUnavailableFilter, setRatingFilter, filtersReducer, initialState }
