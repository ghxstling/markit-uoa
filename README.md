# MarkIt UOA

<div align="center">
<img src="README.assets/Markit UOA.png" alt="Markit UOA" style="zoom: 33%;" />
</div>

MarkIt UOA is a web-based tool specifically crafted to streamline the marker selection process and facilitate students' marking applications. This application is tailored for marker supervisors and coordinators, making it effortless for them to evaluate and promptly respond to applicants. You can see the deployed application [here](https://www.markituoa.xyz/).

## About

Our team used [Jira](https://www.atlassian.com/software/jira) to keep manage our project timeline, as well as for documenting and allocating tickets.

Our backend API documentations can be found [here](https://github.com/uoa-compsci399-s2-2023/capstone-project-team-6/blob/master/docs/API_DOCS.md).

## Installation

1. Clone this repository:

```
git clone https://github.com/uoa-compsci399-s2-2023/capstone-project-team-6.git
```

2. Navigate to the repository directory:

```
cd capstone-project-team-6
```

3. Create a `.env` file in the root directory with the following:

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
ACCESS_KEY_ID_AWS=...
SECRET_ACCESS_KEY_AWS=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...
SENDGRID_API_KEY=...
```

| Name                  | Description                                                                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GOOGLE_CLIENT_ID      | Configuration required for Google OAuth. More information [here](https://developers.google.com/identity/protocols/oauth2)                                   |
| GOOGLE_CLIENT_SECRET  | Configuration required for Google OAuth. More information [here](https://developers.google.com/identity/protocols/oauth2)                                   |
| ACCESS_KEY_ID_AWS     | Access key required to connect with AWS services. More information [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html) |
| SECRET_ACCESS_KEY_AWS | Access key required to connect with AWS services. More information [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html) |
| NEXTAUTH_SECRET       | Key used to encrypt JWT tokens used by NextAuth. More information [here](https://next-auth.js.org/configuration/options)                                    |
| NEXTAUTH_URL          | Set this value to point to the URL of your website. More information [here](https://next-auth.js.org/configuration/options)                                 |
| DATABASE_URL          | This is the connection to your PostgreSQL database. Format can be found [here](https://www.prisma.io/docs/concepts/database-connectors/postgresql)          |
| SENDGRID_API_KEY      | This is the API key used to communicate with Sendgrid. More information can be found [here](https://docs.sendgrid.com/ui/account-and-settings/api-keys)     |

4. Install dependencies:

```
npm install
```

5. Apply migration to database and generate Typescript types from Prisma schema:

```
npm run migrate:dev
```

6. Start development server:

```
npm run dev
```

7. Navigate to http://localhost:3000/ to view application in your browser.

### Additional configuration

-   Ensure that you have created AWS S3 buckets that are referenced in `src/models/bucketNames.ts`.
-   Update `src/models/emailData.ts` to your own email templates found on SendGrid.

## Deployment

### Deploying database

Before deploying the application ensure that the production database has the latest migrations applied. This can be acheived by running `npm run migrate:dev` when the `DATABASE_URL` is pointed at the production PostgreSQL.

### Deploying application to AWS Amplify

Use the following `amplify.yml` when deploying to AWS Amplify:

```yml
version: 1
frontend:
    phases:
        preBuild:
            commands:
                - npm ci
        build:
            commands:
                - env | grep -e GOOGLE_CLIENT_ID >> .env.production
                - env | grep -e GOOGLE_CLIENT_SECRET >> .env.production
                - env | grep -e ACCESS_KEY_ID_AWS >> .env.production
                - env | grep -e SECRET_ACCESS_KEY_AWS >> .env.production
                - env | grep -e NEXTAUTH_SECRET >> .env.production
                - env | grep -e NEXTAUTH_URL >> .env.production
                - env | grep -e DATABASE_URL >> .env.production
                - env | grep -e SENDGRID_API_KEY >> .env.production
                - npm run build
    artifacts:
        baseDirectory: .next
        files:
            - '**/*'
    cache:
        paths:
            - node_modules/**/*
```

Ensure that your `next.config.js` is configured to `output: 'standalone'` to avoid hitting the 200mb file limit on AWS Amplify.

## Technologies

**Built with:**

![TypeScript][typescript-badge]
![postgresql-badge][postgresql-badge]
![Jest][jest-badge]
![Prisma][prisma-badge]
![SendGrid][sendgrid-badge]
![Aws][aws-badge]
![eslint][eslint-badge]
![nextjs][nextjs-badge]
![mui][mui-badge]
![zod][zod-badge]

**Hosted with:**

![awsAmplify][awsAmplify-badge]
![amazonRds][amazonRds-badge]
![amazonS3][amazonS3-badge]

[typescript-badge]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[jest-badge]: https://img.shields.io/badge/-jest%2029.5.3-%23C21325?style=for-the-badge&logo=jest&logoColor=white
[prisma-badge]: https://img.shields.io/badge/-Prisma%205.1.1-2D3748?style=for-the-badge&logo=prisma&logoColor=white
[sendgrid-badge]: https://img.shields.io/badge/-sendgrid%207.7.0-2196F3?style=for-the-badge&logo=twilio&logoColor=white
[postgresql-badge]: https://img.shields.io/badge/-postgresql-4169E1?style=for-the-badge&logo=postgresql&logoColor=white
[aws-badge]: https://img.shields.io/badge/-aws%20sdk%202.455.0-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white
[eslint-badge]: https://img.shields.io/badge/-eslint%208.46.0-4B32C3?style=for-the-badge&logo=eslint&logoColor=white
[nextjs-badge]: https://img.shields.io/badge/-nextjs%2013.5.4-000000?style=for-the-badge&logo=nextjs&logoColor=white
[mui-badge]: https://img.shields.io/badge/-mui%205.14.5-007FFF?style=for-the-badge&logo=mui&logoColor=white
[zod-badge]: https://img.shields.io/badge/-zod%203.22.2-3E67B1?style=for-the-badge&logo=zod&logoColor=white
[awsAmplify-badge]: https://img.shields.io/badge/-aws%20amplify-FF9900?style=for-the-badge&logo=awsamplify&logoColor=white
[amazonRds-badge]: https://img.shields.io/badge/-amazon%20rds-527FFF?style=for-the-badge&logo=amazonrds&logoColor=white
[amazonS3-badge]: https://img.shields.io/badge/-amazon%20s3-569A31?style=for-the-badge&logo=amazons3&logoColor=white

## Scripts

## Usage Examples

## Future Plans
