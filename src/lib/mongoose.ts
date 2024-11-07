import mongoose from 'mongoose'

export const connectToDB = async (): Promise<void> => {
	mongoose.set('strictQuery', true)
	if (mongoose.connection.readyState === 1) {
		console.log('MongoDB is already connected')
		return
	}
	try {
		await mongoose.connect(process.env.MONGODB_URL || '', {
			dbName: 'store',
		})

		console.log('MongoDB connected successfully')
	} catch (err) {
		console.log('MongoDB connection error: ', err)
	}
}
