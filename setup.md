# PRISMA SETUP & USE

## 1. Setup Commands

Install the core Prisma CLI, Client and adapters. Prisma 7 heavily relies on adapters to communicate with the database.
Prisma CLI: `npm install prisma --save-dev`
Prisma Client: `npm install @prisma/client`
PostgreSQL adapters: `npm install @prisma/adapter-pg`

In Prisma 7, environment variables are not loaded by default. To use the environment variables:
dotenv: `npm install dotenv`

Initialize Prisma Project:
command: `npx prisma init`

The above command will create:

1. `prisma.config.ts` file at the root of the project. If you are using plain js and not ts, change its extension to `prisma.config.js`. This is a configuration file.

2. Prisma folder. This contains a `schema.prisma`
   - Change `provide = "prisma-client-js"` if you are using js.
   - add `engineType = "client"`

## 2. Creating models

### - Multimodels (New way)

Unlike the past versions, you can now create multiple models in seperate files in Prisma 7. To do this, you have to create a folder called models inside prisma folder. Then create your files. If you want to create a file for Admin table, you will write: `Admin.prisma` -> `prisma/models/Admin.prisma`. Same applies to other files.

You should change 1 line in prisma.config.js file: Set the value of `schema: "prisma"`. Prisma will recursively look through the prisma/ and look for all the files that have .prisma.

### - Schema.Prisma (Old way)

    You just define all your models under the beginning files.

## 3. Using the client with driver adapters

You should create a prisma/prisma.client.js file. And in this file, write the code below:

import 'dotenv/config';
`import {PrismaClient} from "@prisma/client"; `// `(In multimodels)`
or
`import {PrismaClient} from '../src/prisma/generated/index.js'; `// `(Schema.prisma ... the old way. All the models in the schema.prisma)`
import { PrismaPg } from '@prisma/adapter-pg'

// 1. Setup the adapter
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
// 2. Initialize Prisma with the adapter
const prisma = new PrismaClient({ adapter })

// 3. export glopal prisma api
export default prisma

## 4. Migration and generation

Migration: `npx prisma migrate dev --name init`
Generation: `npx prisma generate`
