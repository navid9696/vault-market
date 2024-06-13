import { CategoryBtnProps } from '@/lib/types'
import { Button } from '@mui/material'

const SubCategoryBtn = ({ onClick, text, isActive }: CategoryBtnProps) => {
	return (
		<Button
			onClick={onClick}
			className={`text-lg mx-6 font-extrabold ${isActive && ' text-green-500'} `}
			color='success'
			variant='text'>
			{text}
		</Button>
	)
}

export default SubCategoryBtn
