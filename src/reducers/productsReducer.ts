import { ActionType, createAction, createReducer } from 'typesafe-actions'
import { ProductCardProps } from '~/components/ProductCard'

const setProducts = createAction('SET_PRODUCTS')<ProductCardProps[]>()
const setSearchTerm = createAction('SET_SEARCH_TERM')<string>()
const setFilteredProducts = createAction('SET_FILTERED_PRODUCTS')<ProductCardProps[]>()

const actions = { setProducts, setSearchTerm, setFilteredProducts }

type ProductsAction = ActionType<typeof actions>

interface State {
	products: ProductCardProps[]
	searchTerm: string
	filteredProducts: ProductCardProps[]
}

const initialState: State = {
	products: [],
	searchTerm: '',
	filteredProducts: [],
}

const productsReducer = createReducer<State, ProductsAction>(initialState)
	.handleAction(setProducts, (state, action) => ({ ...state, products: action.payload }))
	.handleAction(setSearchTerm, (state, action) => ({ ...state, searchTerm: action.payload }))
	.handleAction(setFilteredProducts, (state, action) => ({ ...state, filteredProducts: action.payload }))

export { setFilteredProducts, setProducts, setSearchTerm, productsReducer, initialState }
