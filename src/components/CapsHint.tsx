import { Alert, Button } from '@mui/material'
import { useSession } from 'next-auth/react'
import { trpc } from '~/server/client'
import { useCallback, useState } from 'react'
import TransitionsModal from './TransitionModal'
import ExchangeModal from './ExchangeModal'

const CapsHint = ({ need }: { need: number }) => {
	const { status } = useSession()
	const utils = trpc.useUtils()
	const [modalOpen, setModalOpen] = useState(false)
	const { data: caps } = trpc.exchange.getCapsBalance.useQuery(undefined, { enabled: status === 'authenticated' })
	const have = status === 'authenticated' ? caps?.balance ?? 0 : 0
	const deficit = Math.max(0, need - have)

	const handleModalClose = useCallback(() => {
		setModalOpen(false)
	}, [setModalOpen])

	return (
		<>
			<div className='mt-2 flex items-center justify-between gap-3'>
				{deficit !== 0 && (
					<>
						<Alert severity='warning' className='flex-1'>
							Need {deficit} more Caps
						</Alert>
						<Button variant='contained' onClick={() => setModalOpen(true)}>
							Get Caps
						</Button>
					</>
				)}
			</div>

			<TransitionsModal open={modalOpen} handleClose={handleModalClose}>
				<ExchangeModal
					onClose={handleModalClose}
					onSuccess={() => {
						utils.exchange.getCapsBalance.invalidate()
					}}
				/>
			</TransitionsModal>
		</>
	)
}

export default CapsHint
