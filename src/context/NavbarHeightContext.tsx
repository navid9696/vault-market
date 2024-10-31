import React, { createContext, useContext, useRef, useEffect, useState, PropsWithChildren } from 'react'

interface NavigationContextType {
	navHeight: number
	navRef: React.RefObject<HTMLDivElement>
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export const useNavigationHeight = () => {
	const context = useContext(NavigationContext)
	if (!context) {
		throw new Error('useNavigationHeight must be used within a NavigationProvider')
	}
	return context
}

export const NavigationProvider = ({ children }: PropsWithChildren) => {
	const navRef = useRef<HTMLDivElement>(null)
	const [navHeight, setNavHeight] = useState(0)

	useEffect(() => {
		navRef.current && setNavHeight(navRef.current.offsetHeight)
	}, [])

	return <NavigationContext.Provider value={{ navHeight, navRef }}>{children}</NavigationContext.Provider>
}
