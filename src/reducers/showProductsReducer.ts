import { ActionType, createAction, createReducer } from 'typesafe-actions'
import { ProductCardProps } from '~/components/ProductCard'

const setVisibleProducts = createAction('SET_VISIBLE_PRODUCTS')<ProductCardProps[]>()
const setItemsToShow = createAction('SET_ITEMS_TO_SHOW')<number>()

const actions = { setVisibleProducts, setItemsToShow }

type ShowProductsAction = ActionType<typeof actions>

interface State {
	visibleProducts: ProductCardProps[]
	itemsToShow: number
}

const initialState: State = {
	visibleProducts: [],
	itemsToShow: 9,
}

const showProductsReducer = createReducer<State, ShowProductsAction>(initialState)
	.handleAction(setVisibleProducts, (state, action) => ({ ...state, visibleProducts: action.payload }))
	.handleAction(setItemsToShow, (state, action) => ({ ...state, itemsToShow: action.payload }))

export { setVisibleProducts, setItemsToShow, showProductsReducer, initialState }
