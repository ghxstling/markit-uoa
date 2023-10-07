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
5. **[WIP]** Supervisors
    - `/api/supervisors`
5. Users (will be refactored)
    - `/api/users`

### Courses

**Schema:**
```prisma
model Course {
  id                     Int           @id @default(autoincrement())
  courseCode             String
  courseDescription      String
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
        {
            courseCode: string,
            courseDescription: string,
            numOfEstimatedStudents: number,
            numOfEnrolledStudents: number,
            markerHours: number,
            markerResponsibilities: string,
            needMarkers: boolean,
            markersNeeded: number,
            semester: string
        }
        ```
    - Returns:
        - The newly created `Course`.
- `GET /api/courses/[courseId]`
    - Retrieves a `Course` from the database with the given `courseId`.
    - Returns:
        - The `Course` with the given `courseId`.
- `PATCH /api/courses/[courseId]`
    - You must be a `Supervisor` or `Coordinator` to access this endpoint.
    - Updates an existing `Course` in the database with the given `courseId`.
    - Data required:
        ```typescript
        {
            courseCode: string,
            courseDescription: string,
            numOfEstimatedStudents: number,
            numOfEnrolledStudents: number,
            markerHours: number,
            markerResponsibilities: string,
            needMarkers: boolean,
            markersNeeded: number,
            semester: string
        }
        ```
    - Returns:
        - The updated `Course`.

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
        - An array of `Student`s.
- `POST /api/students`
    - Creates a new `Student` in the database from the data provided in the request body.
    - You must be a `Student` to access this endpoint.
    - Data required:
        ```typescript
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
        - The `Student` with the given `studentUpi`.
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
  allocatedHours          Int     @default(5)
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
- `GET /api/courses/[courseId]/applications`
    - Retrieves `Student` `Application`s for a given `Course`.
    - You must be a `Supervisor` or `Coordinator` to access this endpoint.
    - Returns:
        - An array of `Application`s for a given `Course`.
- `PATCH /api/courses/[courseId]/applications/[applicationId]`
    - Updates the preference number and qualification status for a `Student` `Application` for a given `Course`.
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
- `GET /api/students/me/applications`
    - Retrieves a `Student`'s own `Application`s.
    - You must be a `Student` to access this endpoint.
    - Returns:
        - An array of the `Student`'s own `Application`s.
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
  allocatedHours          Int     @default(5)
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

### Supervisor (WIP)

This section is a work in progress. Information regarding this section is subject to change.

**Schema:**
```prisma
model Supervisor {
    id          @id         @default(autoincrement())
    user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
    userId      Int         @unique
    courses     Courses[]
}
```
**Endpoints:**

- `GET /api/supervisors`
- `POST /api/supervisors`
- `GET /api/supervisors/[supervisorId]`
- `GET /api/supervisors/[supervisorId]/courses`
- `GET /api/supervisors/me/courses`
