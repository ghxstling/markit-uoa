import type { Prisma } from '@prisma/client'
import StudentRepo from '@/data/studentRepo'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import s3Client from '@/libs/s3client'
import { BucketNames } from '@/models/bucketNames'

type Student = Exclude<Prisma.PromiseReturnType<typeof StudentRepo.getStudentByEmail>, null>

// s3 transcript format: "{upi}-transcript"
// s3 cv format: "{upi}-cv"

export default class S3Service {
    static async _uploadFile(keyName: string, file: File, contentType: string, bucketName: BucketNames) {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: keyName,
            Body: buffer,
            ContentType: contentType,
        })
        console.log('Sending file ' + file.name + ' to bucket ' + bucketName + '...')
        await s3Client.send(command)
        const response = await s3Client.send(command)
        console.log('Success! Response:\n' + response)
        return response
    }

    static async uploadTranscript(student: Student, file: File) {
        const keyName = student.upi + '-transcript'
        const response = await this._uploadFile(keyName, file, 'application/pdf', BucketNames.transcripts)
        const updatedStudent = await StudentRepo.setTranscriptFilename(student.upi, keyName)
        return { response, updatedStudent }
    }

    static async uploadCV(student: Student, file: File) {
        const keyName = student.upi + '-cv'
        const response = await this._uploadFile(keyName, file, 'application/pdf', BucketNames.cvs)
        const updatedStudent = await StudentRepo.setCVFilename(student.upi, keyName)
        return { response, updatedStudent }
    }
}
