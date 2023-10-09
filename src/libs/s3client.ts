import { S3Client } from '@aws-sdk/client-s3'

const accessKeyId = process.env.ACCESS_KEY_ID_AWS
const secretAccessKey = process.env.SECRET_ACCESS_KEY_AWS

if (!accessKeyId) throw new Error('Missing env.AWS_ACCESS_KEY_ID')
if (!secretAccessKey) throw new Error('Missing env.AWS_SECRET_ACCESS_KEY')

const s3Client = new S3Client({
    region: 'ap-southeast-2',
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
})
export default s3Client
