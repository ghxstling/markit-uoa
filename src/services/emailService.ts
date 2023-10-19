import CourseRepo from '@/data/courseRepo';
import StudentRepo from '@/data/studentRepo';
import SupervisorRepo from '@/data/supervisorRepo';
import UserRepo from '@/data/userRepo';
import { EmailData } from '@/models/emailData';
import { Application } from '@prisma/client';
import sgMail from '@sendgrid/mail';

type Message = {
    from: {
        email: string,
        name: string
    }
    personalizations: MarkerPersonalization[] | SupervisorPersonalization[],
    templateId: string,
}

type Personalization = {
    to: {
        email: string,
        name: string,
    }
}

type MarkerPersonalization = Personalization & {
    dynamicTemplateData: {
        studentName: string,
        courseCode: string,
        hours: number,
    }
} 
type SupervisorPersonalization = Personalization & {
    dynamicTemplateData: {
        supervisorName: string,
        courseCode: string,
        totalHours: number,
        markerNames: string[],
    }
}

type MarkerDataValue = {
    studentName: string,
    studentEmail: string,
    hours: number,
}

type SupervisorDataValue = {
    supervisorName: string,
    supervisorEmail: string,
    hours: number,
} | null

export default class EmailService {
    private apiKey: string | undefined;

    constructor() {
        this.apiKey = process.env.SENDGRID_API_KEY;
        if (!this.apiKey) throw new Error('Missing process.env.SENDGRID_API_KEY')
        sgMail.setApiKey(this.apiKey);
    }

async createMarkerHashMap(markers: Application[]) {
        // key: courseId, value: { studentName, studentEmail, hours }
        const markerHashMap = new Map<number, MarkerDataValue[]>()

        console.log('Generating markerHashMap...')
        for (const m of markers) {
            const course = await CourseRepo.getCourseById(m.courseId)
            if (!markerHashMap.has(course!.id)) {
                markerHashMap.set(course!.id, [])
            }
            
            const student = await StudentRepo.getStudentById(m.studentId)
            const user = await UserRepo.getUserById(student!.userId)
            const markerData = {
                studentName: user!.name!,
                studentEmail: student!.preferredEmail!,
                hours: m.allocatedHours,
            }

            let markersForCourse = markerHashMap.get(course!.id)
            if (!markersForCourse!.includes(markerData)) {
                markersForCourse!.push(markerData)
                markerHashMap.set(course!.id, markersForCourse!)
            }
        }
        const sortedMarkerMap = new Map([...markerHashMap.entries()].sort((a, b) => a[0] - b[0]))
        console.log(sortedMarkerMap)
        return sortedMarkerMap
    }

    async createSupervisorHashMap(markers: Application[]) {
        // key: courseId, value: { studentName, studentEmail, hours }
        const supervisorHashMap = new Map<number, SupervisorDataValue>()

        console.log('Generating supervisorHashMap...')
        for (const m of markers) {
            const course = await CourseRepo.getCourseById(m.courseId)

            if (!course!.supervisorId) {
                console.log('courseId ' + course!.id + ' has no supervisor ID!')
                continue
            }
            if (!supervisorHashMap.has(course!.id)) supervisorHashMap.set(course!.id, null)
            if (supervisorHashMap.get(course!.id) != null) {
                console.log('courseId ' + course!.id + ' has value ' + JSON.stringify(supervisorHashMap.get(course!.id) ))
                continue
            }

            const supervisor = await SupervisorRepo.getSupervisorById(course!.supervisorId)
            const user = await UserRepo.getUserById(supervisor!.userId)
            const supervisorData = {
                supervisorName: user!.name!,
                supervisorEmail: user!.email!,
                hours: m.allocatedHours,
            }

            supervisorHashMap.set(course!.id, supervisorData!)
        }

        const sortedSupervisorMap = new Map([...supervisorHashMap.entries()].sort((a, b) => a[0] - b[0]))
        console.log(sortedSupervisorMap)
        return sortedSupervisorMap
    }

    async createMarkerEmails(markerHashMap: Map<number, MarkerDataValue[]>) {        
        console.log('Creating Marker Emails...')

        let personalizations = []
        for (const [courseId, markerDataValues] of markerHashMap) {
            const course = await CourseRepo.getCourseById(courseId)
            for (const m of markerDataValues) {
                const data = {
                    to: {
                        email: m.studentEmail,
                        name: m.studentName,
                    },
                    dynamicTemplateData: {
                        studentName: m.studentName,
                        courseCode: course!.courseCode,
                        hours: m.hours,
                    }
                }
                personalizations.push(data)
            }
        }

        const markerMsg: Message = {
            from: {
                email: EmailData.SenderEmail,
                name: EmailData.SenderName
            },
            personalizations,
            templateId: EmailData.MarkerTemplate,
        }
        return markerMsg
    }

    async createSupervisorEmails(supervisorHashMap: Map<number, SupervisorDataValue>, markerHashMap: Map<number, MarkerDataValue[]>) {
        console.log('Creating Supervisor Emails...')

        let personalizations = []
        for (const [courseId, supervisorData] of supervisorHashMap) {
            const course = await CourseRepo.getCourseById(courseId)
            if (!course!.supervisorId) continue

            let markerNames = []
            let totalHours = 0
            const markers = markerHashMap.get(course!.id)
            for (const m of markers!) {
                markerNames.push(`${m.studentName} (${m.studentEmail}), ${m.hours} hours per week`)
                totalHours += m.hours
            }

            const data = {
                to: {
                    email: supervisorData!.supervisorEmail,
                    name: supervisorData!.supervisorName,
                },
                dynamicTemplateData: {
                    supervisorName: supervisorData!.supervisorName,
                    courseCode: course!.courseCode,
                    totalHours,
                    markerNames
                }
            }
            personalizations.push(data)
        }

        const supervisorMsg: Message = {
            from: {
                email: EmailData.SenderEmail,
                name: EmailData.SenderName
            },
            personalizations,
            templateId: EmailData.SupervisorTemplate,
        }
        return supervisorMsg
    }

    async sendEmail(msg: Message) {
        try {
            console.log('Sending email to: ' + msg.personalizations.map((p) => p.to.email) + ' ...');
            const res = await sgMail.send(msg);
            console.log('Email sent successfully!');
            return res
        } catch (error) {
            console.error('Error: ' + error);
            return null
        }
    }
}
