#!/bin/bash
export DATABASE_URL="postgresql://neondb_owner:npg_jTvM7A5DUVhS@ep-purple-lab-ag8tnno0-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
npx prisma db push --skip-generate
npx prisma generate
