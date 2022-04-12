import dotenv from 'dotenv'
dotenv.config()

const app = async () => {
  console.log(`Hello ${process.env.SECRET_MESSAGE}`)
}

try {
  await app()
} catch (e) {
  console.error(e.message)
}