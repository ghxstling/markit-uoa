import ApplicationRepo from '@/data/applicationRepo'
import CourseRepo from '@/data/courseRepo'
import UserRepo from '@/data/userRepo'
import StudentRepo from '@/data/studentRepo'
import { createObjectCsvWriter } from 'csv-writer'
import fs from 'fs'
import path from 'path'

type Record = {
    id: string,
    course: string,
    semester: string,
    studentName: string,
    upi: string,
    auid: string,
    email: string,
    degree: string,
    degreeYears: string,
    maxWorkHours: string,
    hasCompletedCourse: string,
    grade: string,
    notTakenExplanation: string,
    hasTutored: string,
    hasMarked: string,
    equivalentQualificaton: string,
    qualified: string,
    cv: string,
    transcript: string,
}

export default class ApplicationService {

    static async createCsvFile() {
        console.log('Creating CSV file ...')

        const applications = await ApplicationRepo.getAllApplications()
        const filePath = path.join(__dirname, '../../../../../cache/applications.csv')
        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'id', title: 'ID' },
                { id: 'course', title: 'COURSE' },
                { id: 'semester', title: 'SEMESTER' },
                { id: 'studentName', title: 'STUDENT NAME' },
                { id: 'upi', title: 'UPI' },
                { id: 'auid', title: 'AUID' },
                { id: 'email', title: 'EMAIL' },
                { id: 'degree', title: 'DEGREE' },
                { id: 'degreeYears', title: 'STUDY YEAR' },
                { id: 'maxWorkHours', title: 'MAX WORK HOURS' },
                { id: 'hasCompletedCourse', title: 'COMPLETED COURSE?' },
                { id: 'grade', title: 'GRADE' },
                { id: 'notTakenExplanation', title: 'NOT TAKEN EXPLANATION' },
                { id: 'hasTutored', title: 'TUTORED BEFORE?' },
                { id: 'hasMarked', title: 'MARKED BEFORE?' },
                { id: 'equivalentQualificaton', title: 'EQUIVALENT QUALIFICATION' },
                { id: 'qualified', title: 'QUALIFIED?' },
                { id: 'cv', title: 'CV' },
                { id: 'transcript', title: 'ACADEMIC TRANSCRIPT' },
            ]
        })

        let records: Record[] = []
        for (const app of applications) {
            const course = await CourseRepo.getCourseById(app.courseId)
            const student = await StudentRepo.getStudentById(app.studentId)
            const user = await UserRepo.getUserById(student!.userId)

            let record: Record = {
                id: app.id.toString(),
                course: course!.courseCode,
                semester: course!.semester,
                studentName: user!.name!,
                upi: student!.upi,
                auid: student!.auid.toString(),
                email: student!.preferredEmail,
                degree: student!.degreeType,
                degreeYears: student!.degreeYear.toString(),
                maxWorkHours: student!.maxWorkHours.toString(),
                hasCompletedCourse: app.hasCompletedCourse ? 'Yes' : 'No',
                grade: app.previouslyAchievedGrade ? app.previouslyAchievedGrade : 'null',
                notTakenExplanation: app.notTakenExplanation ? app.notTakenExplanation : 'null',
                hasTutored: app.hasTutoredCourse ? 'Yes' : 'No',
                hasMarked: app.hasMarkedCourse ? 'Yes' : 'No',
                equivalentQualificaton: app.equivalentQualification ? app.equivalentQualification : 'null',
                qualified: app.isQualified ? 'Yes' : 'No',
                cv: `markituoa.xyz/api/students/${student!.upi}/cv`,
                transcript: `markituoa.xyz/api/students/${student!.upi}/transcript`,
            }
            records.push(record)
        }

        try {
            await csvWriter.writeRecords(records)
            console.log('File created successfully at ' + path.join(__dirname, '../../../../../cache/applications.csv'))
            return true
        } catch (err) {
            console.log('Failed to create CSV file')
            console.log(err)
            return false
        }
    }

    static async getCsvFile() {
        const filePath = path.join(__dirname, '../../../../../cache/applications.csv')
        const data = fs.readFileSync(filePath)
        const stat = fs.statSync(filePath)
        return { data, stat }
    }
}
