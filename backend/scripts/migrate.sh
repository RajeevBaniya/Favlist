#!/bin/bash
# Database migration script

echo "Running Prisma migrations..."
npx prisma migrate dev --name init

echo "Generating Prisma Client..."
npx prisma generate

echo "Migration completed!"

