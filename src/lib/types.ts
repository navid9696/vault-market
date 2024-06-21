import { ChangeEventHandler, MouseEventHandler } from 'react'

export interface ExchangeInputProps {
	icon: React.ReactNode
	inputProp?: { [key: string]: string | number | boolean | null | undefined }
	onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined | (() => void)
}

export interface CategoryBtnProps {
	text: string
	onClick?: MouseEventHandler<HTMLButtonElement> | undefined| (() => void)
	isActive?: number | null | boolean
}
