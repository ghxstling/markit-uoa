# Markit-UOA API Documentation

This documentation outlines all the current/future endpoints that Markit-UOA will use. The API is for development purposes and should not be shared publicly alongside this documentation.

Made by Dylan Choy (the One Man Army)

## Table of Contents

1. Courses 
    - `/api/courses`
2. Students 
    - `/api/students` 
3. Applications     
    - `/api/applications`  
    - `/api/courses/[courseId]/applications`  
    - `/api/students/.../applications`
4. Markers
    - `/api/courses/[courseId]/markers`
5. Supervisors
    - `/api/supervisors`
5. Users
    - `/api/users`
6. Changelog

### Courses

**Schema:**
```prisma
model Course {
  id                     Int           @id @default(autoincrement())
  courseCode             String
  courseDescription      String
  supervisor             Supervisor?   @relation(fields: [supervisorId], references: [id], onDelete: Cascade)
  supervisorId           Int?          
  numOfEstimatedStudents Int
  numOfEnrolledStudents  Int
  markerHours            Int
  markerResponsibilities String
  needMarkers            Boolean       @default(true)
  markersNeeded          Int
  semester               String
  modifiedAt             DateTime      @default(now()) @updatedAt
  // one to one with Application
  application            Application[]
}
```

**Endpoints:**
- `GET /api/courses`
    - Retrieves all `Course`s from the database.
    - Returns:
        - An array of `Course`s.
    
- `POST /api/courses`
    - Creates a new `Course` in the database from the data provided in the request body.
    - You must be a `Supervisor` or `Coordinator` to access this endpoint.
    - Data required:
        ```typescript
        // Course
        {
            courseCode: string,
            courseDescription: string,
            supervisorId: number | null,
            numOfEstimatedStudents: number,
            numOfEnrolledStudents: number,
            markerHours: number,
            markerResponsibilities: string,
            needMarkers: boolean,
            markersNeeded: number,
            semester: string,
        }
        ```
    - Returns:
      
        - The newly created `Course`.
    
- `GET /api/courses/with-markers`
    - Retrieves all `Course`s from the database with assigned `Marker`s.
    - Returns:
        - An array of `Course`s with `allocatedHours` and `assignedMarkers` included.

- `GET /api/courses/[courseId]`
    - Retrieves a `Course` from the database with the given `courseId`.
    - Returns:
        - The `Course` with the given `courseId`.
    
- `PATCH /api/courses/[courseId]`
    - You must be a `Supervisor` or `Coordinator` to access this endpoint.
    - Updates an existing `Course` in the database with the given `courseId`.
    - Data required:
        ```typescript
        // Course
        {
            courseCode: string,
            courseDescription: string,
            supervisorId: number | null,
            numOfEstimatedStudents: number,
            numOfEnrolledStudents: number,
            markerHours: number,
            markerResponsibilities: string,
            needMarkers: boolean,
            markersNeeded: number,
            semester: string,
        }
        ```
    - Returns:
      
        - The updated `Course`.
- `DELETE /api/courses/[courseId]`
    - Deletes a `Course` in the database with the given `courseId`.
    - You must be a `Coordinator` to access this endpoint.
    - Returns:
        - The deleted `Course` with the given `courseId`.

### Students

**Schema:**
```prisma
model Student {
  id                    Int           @id @default(autoincrement())
  // one to one with User
  user                  User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId                Int           @unique
  preferredEmail        String
  upi                   String        @unique
  auid                  Int           @unique
  overseas              Boolean       @default(false)
  overseasStatus        String?
  residencyStatus       Boolean       @default(true)
  validWorkVisa         Boolean?      @default(true)
  degreeType            String
  degreeYear            Int
  maxWorkHours          Int           @default(5)
  otherContracts        Boolean       @default(false)
  otherContractsDetails String?
  CV                    String?
  academicTranscript    String?
  // one to many with Application
  applications          Application[]
}
```

**Endpoints:**

- `GET /api/students`
    - Retrieves all `Student`s from the database.
    - You must be a `Supervisor` or `Coordinator` to access this endpoint.
    - Returns:
        - An array of `Student`s with `Application`s.
- `POST /api/students`
    - Creates a new `Student` in the database from the data provided in the request body.
    - You must be a `Student` to access this endpoint.
    - Data required:
        ```typescript
        // Student
        {
            preferredEmail: string,
            upi: string,
            auid: number,
            overseas: boolean,
            overseasStatus: string,
            residencyStatus: boolean,
            validWorkVisa: boolean,
            degreeType: string,
            degreeYear: number,
            maxWorkHours: number,
            otherContracts: boolean,
            otherContractsDetails: string
        }
        ```
    - Returns:
      
        - The newly created `Student`.
- `GET /api/students/[studentUpi]`
    - Retrieves a `Student` from the database with the given `studentId`.
    - You must be a `Supervisor` or `Coordinator` to access this endpoint.
    - Returns:
        - The `Student` with the given `studentUpi` and `application`s and `course`s.
- `GET /api/students/[studentUpi]/cv`
    - Retrieves a `Student`'s CV from the connected AWS S3 bucket.
    - You must be a `Supervisor` or `Coordinator` to access this endpoint.
    - Returns:
        - The `Student`'s CV file.
- `GET /api/students/[studentUpi]/transcript`
    - Retrieves a `Student`'s transcript from the connected AWS S3 bucket.
    - You must be a `Supervisor` or `Coordinator` to access this endpoint.
    - Returns:
        - The `Student`'s transcript file.
- `GET /api/students/me`
    - Retrieves a `Student`'s own information.
    - You must be a `Student` to access this endpoint
    - Returns:
        - The respective `Student`.
- `GET /api/students/me/cv`
    - Retrieves a `Student`'s own CV from the connected AWS S3 bucket.
    - You must be a `Student` to access this endpoint.
    - Returns:
        - The `Student`'s own CV file.
- `POST /api/students/me/cv`
    - Uploads a `Student`'s own CV to the connected AWS S3 bucket.
    - You must be a `Student` to access this endpoint.
    - Data Required:
        ```typescript
        // File
        {
            FormData: {
                file: File
            }
        }
        ```
    - Returns:
        - The updated `Student` object
        - The CV file.
- `GET /api/students/me/transcript`
    - Retrieves a `Student`'s own transcript from the connected AWS S3 bucket.
    - You must be a `Student` to access this endpoint.
    - Returns:
        - The `Student`'s own transcript file.
- `POST /api/students/me/transcript`
    - Uploads a `Student`'s own transcript to the connected AWS S3 bucket.
    - You must be a `Student` to access this endpoint.
    - Data Required:
        ```typescript
        // File
        {
            FormData: {
                file: File
            }
        }
        ```
    - Returns:
        - The updated `Student` object
        - The transcript file.

**Additional Notes:**

There are two different groups of endpoints for `Student`s:
- `/api/students/[studentUpi]`
- `/api/students/me`

The rationale behind this is that a `Student` should not be allowed access to other `Student`s' information such as CV and Transcript, and should only be allowed to view their own. However, `Supervisors` and `Coordinators` need the ability to see each `Student`'s information, hence the protected `/api/students/[studentUpi]` endpoint.  

### Applications

**Schema:**

```prisma
model Application {
  id                      Int     @id @default(autoincrement())
  applicationStatus       String  @default("pending")
  allocatedHours          Int     @default(0)
  preferenceId            Int
  // many to one with Student
  student                 Student @relation(fields: [studentId], references: [id], onDelete: Cascade)
  studentId               Int
  // many to one with Course
  course                  Course  @relation(fields: [courseId], references: [id], onDelete: Cascade)
  courseId                Int
  // one to one with Course
  hasCompletedCourse      Boolean
  previouslyAchievedGrade String? // needed if hasCompletedCourse is true
  hasTutoredCourse        Boolean
  hasMarkedCourse         Boolean
  notTakenExplanation     String? // needed if hasCompletedCourse is false
  equivalentQualification String? // needed if hasTutoredCourse && hasMarkedCourse is false
  isQualified             Boolean @default(false)

  @@unique([studentId, courseId])
}
```

**Endpoints:**

- `GET /api/applications`
    - Retrieves all `Student` `Application`s from the database.
    - You must be a `Supervisor` or `Coordinator` to access this endpoint.
    - Returns:
        - An array of `Application`s.
- `POST /api/applications`
  
    - Creates one or more `Student` `Application`s in the database.
    - You must be a `Student` to access this endpoint.
    - Data Required:
        ```typescript
        // An array of Applications
        {
            preferenceId: number,
            studentId: number,
            courseId: number,
            hasCompletedCourse: boolean,
            previouslyAchievedGrade: string,
            hasTutoredCourse: boolean,
            hasMarkedCourse: boolean,
            notTakenExplanation: string,
            equivalentQualification: string
        }[]
        ```
    - Returns:
      
        - An array of newly created `Application`s.
- `GET /api/applications/csv`
    - Creates and returns a CSV file of all `Student` `Application`s.
    - You must be a `Supervisor` or `Coordinator` to access this endpoint.
    - Returns:
        - A CSV file of all `Application`s.
- `GET /api/courses/[courseId]/applications`
    - Retrieves `Student` `Application`s for a given `Course`.
    - You must be a `Supervisor` or `Coordinator` to access this endpoint.
    - Returns:
        - An array of `Application`s for a given `Course`.
- `GET /api/students/[studentUpi]/applications`
    - Retrieves all `Application`s for a given `Student`.
    - You must be a `Supervisor` or `Coordinator` to access this endpoint.
    - Returns:
        - An array of `Application`s for a given `Student`.
- `GET /api/students/[studentUpi]/applications/[applicationId]`
    - Retrieves a particular `Application` for a given `Student` using its `applicationId`.
    - You must be a `Supervisor` or `Coordinator` to access this endpoint.
    - Returns:
        - The specified `Application` for a given `Student`.
- `PATCH /api/students/[studentUpi]/applications/[applicationId]`
    - Updates the qualification status of a `Student` `Application` for a given `Course`.
    - You must be a `Supevisor` or `Coordinator` to access this endpoint.
    - Data Required:
    ```typescript
    {
        isQualified: boolean,
    }
    ```
    - Returns:
        - The updated `Student`'s `Application`
- `GET /api/students/me/applications`
    - Retrieves a `Student`'s own `Application`s.
    - You must be a `Student` to access this endpoint.
    - Returns:
        - An array of the `Student`'s own `Application`s.
- `PATCH /api/students/me/applications`
    - Updates the `preferenceId`s of a `Student`'s own `Application`s.
    - You must be a `Student` to access this endpoint.
    - Data Required:
        ```typescript
        // An array of Applications
        {
            preferenceId: number,
            studentId: number,
            courseId: number,
            hasCompletedCourse: boolean,
            previouslyAchievedGrade: string,
            hasTutoredCourse: boolean,
            hasMarkedCourse: boolean,
            notTakenExplanation: string,
            equivalentQualification: string
        }[]
        ```
    - Returns:
        - The updated `Student`'s `Application`
- `GET /api/students/me/applications/[applicationId]`
    - Retrieves a `Student`'s own particular `Application` using its `applicationId`.
    - You must be a `Student` to access this endpoint.
    - Returns:
        - The specified `Application` that belongs to the `Student`.

**Additional Notes:**

Refer to the **Additonal Notes** under the **Students** section for `/api/students/me` and `/api/students/[studentUpi]`.

### Markers

**Schema:**
```prisma
model Application {
  id                      Int     @id @default(autoincrement())
  applicationStatus       String  // applicationStatus must be "approved" to be a marker
  allocatedHours          Int     @default(0)
  preferenceId            Int
  // many to one with Student
  student                 Student @relation(fields: [studentId], references: [id], onDelete: Cascade)
  studentId               Int
  // many to one with Course
  course                  Course  @relation(fields: [courseId], references: [id], onDelete: Cascade)
  courseId                Int
  // one to one with Course
  hasCompletedCourse      Boolean
  previouslyAchievedGrade String? // needed if hasCompletedCourse is true
  hasTutoredCourse        Boolean
  hasMarkedCourse         Boolean
  notTakenExplanation     String? // needed if hasCompletedCourse is false
  equivalentQualification String? // needed if hasTutoredCourse && hasMarkedCourse is false
  isQualified             Boolean @default(false)

  @@unique([studentId, courseId])
}
```

**Endpoints:**

- `GET /api/courses/[courseId]/markers`
    - Retrieves all `Marker`s for a given `Course`.
    - You must be a `Coordinator` to access this endpoint.
    - Returns:
        - An array of `Marker`s for a given `Course`.
        - The total number of hours allocated to the `Course`.
- `POST /api/courses/[courseId]/markers`
    - Assigns an array of `Marker`s for a given `Course`.
    - You must be a `Coordinator` to access this endpoint.
    - Data Required:
        ```typescript
        // An Array of Markers (Applications)
        {
            preferenceId: number,
            studentId: number,
            courseId: number,
            hasCompletedCourse: boolean,
            previouslyAchievedGrade: string,
            hasTutoredCourse: boolean,
            hasMarkedCourse: boolean,
            notTakenExplanation: string,
            equivalentQualification: string
        }[]
        ```
    - Returns:
        - An array of `Marker`s for a given `Course`.
        - The total number of hours allocated to the `Course`.
- `PATCH /api/courses/[courseId]/markers/[markerId]`
    - Updates a `Marker`'s details for a given `Course`.
    - You must be a `Coordinator` to access this endpoint.
    - Data Required:
        ```typescript
        {
            allocatedHours: number,
            isQualified: boolean
        }
        ```
    - Returns:
      
        - The updated `Marker` for a given `Course`.
- `DELETE /api/courses/[courseId]/markers/[markerId]`
    - Removes a `Marker` from a given `Course`.
    - You must be a `Coordinator` to access this endpoint.
    - Returns:
        - The deleted `Marker` from a given `Course`.

**Additional Notes:**

There is no schema defined for `Marker`, rather `Application` is reused. For the purpose of this API, a `Marker` is represented by an `Application` that has been approved by a `Coordinator`. This is done to eliminate potential data redundancy and to simplify the database schema.

### Supervisors

**Schema:**
```prisma
model Supervisor {
  id        Int       @id @default(autoincrement())
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    Int       @unique
  courses   Course[]
}
```

**Endpoints:**

- `GET /api/supervisors`
    - Retrieves all `Supervisor`s from the database.
    - You must be a `Coordinator` to access this endpoint.
    - Returns:
        - An array of `Supervisor`s.
- `GET /api/supervisors/me`
    - Retrieves a `Supervisor`'s own information.
    - You must be a `Supervisor` to access this endpoint
    - Returns:
        - The respective `Supervisor`.
- `GET /api/supervisors/me/courses`
    - Retrieves a `Supervisor`'s own `Course`s.
    - You must be a `Supervisor` or `Coordinator` to access this endpoint.
    - Returns:
        - An array of the `Supervisor`'s own `Course`s.
- `GET /api/supervisors/[supervisorId]`
    - Retrieves a `Student` from the database with the given `supervisorId`.
    - You must be a `Coordinator` to access this endpoint.
    - Returns:
        - The `Student` with the given `supervisorId`.
- `GET /api/supervisors/[supervisorId]/courses`
    - Retrieves all `Course`s for a given `Supervisor`.
    - You must be a `Coordinator` to access this endpoint.
    - Returns:
        - An array of `Course`s for a given `Supervisor`.

**Additional Notes:**

Similar to `Student` endpoints, there are two different groups of endpoints for `Supervisor`s:
- `/api/supervisors/[supervisorId]`
- `/api/supervisors/me`

Although there is limited information to show for a `Supervisor`, a `Supervisor` should not be allowed access to other `Supervisor`s' information, and should only be allowed to view their own, should these endpoints be used in the future. Whereas, `Coordinator`s have the ability to see each `Supervisor`'s information, hence the protected `/api/supervisors/[supervisorId]` endpoint.

### Users

**Schema:**
```prisma
model User {
  id          Int      @id @default(autoincrement())
  email       String   @unique
  name        String?
  role        String   @default("student") // Refer to the role enum in models/role.ts
  // one to one with Student
  student     Student?
  // one to one with Supervisor
  supervisor  Supervisor?
}
```

**Endpoints:**

- `GET /api/users`
    - Retrieves all `User`s from the database.
    - You must be a `Coordinator` to access this endpoint.
    - Returns:
        - An array of `User`s.
- `GET /api/users/[userId]`
    - Retrieves a `User` from the database with the given `userId`.
    - You must be a `Coordinator` to access this endpoint.
    - Returns:
        - The `User` with the given `userId`.
- `PATCH /api/users/[userId]`
    - Updates a `User`'s role for a given `userId`.
    - You must be a `Coordinator` to access this endpoint.
    - Data Required:
        ```typescript
        {
            role: Role
        }
        ```
    - Returns:
      
        - The updated `User` for a given `userId`.

### Changelog

- v1.0.0
    - Initial release
        - Added `Courses` section
        - Added `Students` section
        - Added `Applications` section
        - Added `Markers` section
        - Added `Supervisors` section (WIP)
        - Added `Users` section (WIP)
- v1.1.0
    - Added `Changelog` section
    - Updated `Course` schema:
        - Added `supervisor` and `supervisorId` fields
    - Updated `Supervisors` section
        - Added `GET /api/supervisors` endpoint
        - Added `GET /api/supervisors/me` endpoint
        - Added `GET /api/supervisors/me/courses` endpoint
        - Added `GET /api/supervisors/[supervisorId]` endpoint
        - Added `GET /api/supervisors/[supervisorId]/courses` endpoint
    - Updated `Users` section
        - Added `GET /api/users` endpoint
        - Added `GET /api/users/[userId]` endpoint
        - Added `PATCH /api/users/[userId]` endpoint
- v1.1.1
    - Updated `Applications` section:
        - Added `PATCH /api/students/[studentUpi]/applications/[applicationId]` endpoint
- v1.1.2
    - Updated `Applications` section:
        - Updated `PATCH /api/students/[studentUpi]/applications/[applicationId]` endpoint
            - Changed `Data Required` to `isQualified: boolean` only
        - Added `PATCH /api/students/me/applications/[applicationId]` endpoint
- v1.1.3
    - Updated `Applications` section:
        - Added `GET /api/applications/csv` endpoint
        - Removed `PATCH /api/students/me/applications/[applicationId]` endpoint
        - Added `PATCH /api/students/me/applications` endpoint
    - Updated `Courses` section:
        - Added `GET /api/courses/with-markers` endpoint
- v1.1.4
    - Updated `Courses` section:
        - Added `DELETE /api/courses/[courseId]` endpoint
