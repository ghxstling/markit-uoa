import type { Prisma } from '@prisma/client'
import StudentRepo from '@/data/studentRepo'
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
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
        console.log("File '" + file.name + "' successfully uploaded to bucket '" + bucketName + "'.")
        return response
    }

    static async _getFile(keyName: string, bucketName: BucketNames, contentType: string) {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: keyName,
            ResponseContentType: contentType,
        })
        console.log('Retrieving file ' + keyName + ' from bucket ' + bucketName + '...')
        const response = await s3Client.send(command)
        const outContentType = response.ContentType
        const outData = await response.Body?.transformToByteArray()
        return { contentType: outContentType, data: outData }
    }

    static async getTranscript(student: Student) {
        const keyName = student.upi + '-transcript'
        const { contentType, data } = await this._getFile(keyName, BucketNames.transcripts, 'application/pdf')
        return { contentType, data }
    }

    static async getCV(student: Student) {
        const keyName = student.upi + '-cv'
        const { contentType, data } = await this._getFile(keyName, BucketNames.cvs, 'application/pdf')
        return { contentType, data }
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
