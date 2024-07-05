import { Dispatch, SetStateAction } from 'react'

export interface SettingFormsProps {
	setIsDetailsVisible: Dispatch<SetStateAction<boolean>>
	handleClose?: () => void
}
