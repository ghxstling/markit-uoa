import { useRouter } from 'next/router';
import { number } from 'zod';

export default function viewStudentInformation(){

    interface Student{
        id: number
        upi: string
        auid: number
        email: string
        overseas: boolean
        residencyStatus: boolean
        validWorkVisa: boolean
        degreeYear: number
        maxWorkHours: number
        degreeType: string
    }

    const router = useRouter();
    const { studentId } = router.query;

    return(
        
    )
}