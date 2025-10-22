# Technical Take-Home

Congrats on making it through to our Technical Assessment! We are excited to see your skills brought to life through this next phase of our interview process.

### What You’ll Be Building

The goal of this challenge is to build a **small Next.js app** that simulates a simplified version of a healthcare staffing marketplace where **providers can browse and apply to shifts**.

Some core context: A shift is **Open** until a provider is **Hired**. No auth is required; use a simple “switch user” control to act as different users. We’ll provide a few images as loose design references (you don’t need to match them)

**Technology Stack suggestion:**

- Next.js (This is the only real requirement)
- Prisma
- Tailwind, but any UI lib is fine

> Submission: Push to a public GitHub repo and invite @julianianni as a collaborator. Add a short Loom or README section explaining your choices.

---

## Functional Requirements

### Core user flows (no auth)

1. **Browse shifts**
   - Show a list of shifts with key details (title, facility, dates/times, rate, location, status). ✅
   - Each shift shows if the current (selected) user has already applied. ✅
   - Clicking a shift opens a details view. ✅
2. **Apply / Withdraw**
   - From the list and/or details, the current user can **Apply** to an Open shift. ✅
   - If already applied, allow **Withdraw** (optional but nice to have). ✅
   - Prevent duplicate applications (same user, same shift). ✅
3. **Applications view**
   - A simple page where the current user sees **their applications** and the status of each related shift. ✅
4. **Hire endpoint (for next interview)**
   - Provide an API route that **hires** a provider **given `applicationId` and `shiftId`**. ✅
   - This must update the shift to **HIRED**, record which user was hired, and (optionally) update the application’s status. ✅
   - We should be able to **fetch/curl** this endpoint directly (no UI required). ✅
   - See the API contract below. ✅
5. **State rules**
   - A shift is **OPEN** until a provider is hired. ✅
   - When hired:
     - The shift becomes **HIRED**. ✅
     - `hiredProviderId` is set to the application’s `userId`. ✅
     - Further applications to that shift should be disabled (or clearly rejected by API). ✅

### Nice-to-haves (choose any)

- Filter/sort shifts (by date, rate, status). ✅
- Basic optimistic updates on apply/withdraw. ✅
- Tests for core flows.

## Data Model (Prisma)

You must have exactly these three models: User, Shift, Application. Fields are up to you.

```
// prisma/schema.prisma
datasource db {
  provider = "sqlite" // you can switch to "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum ShiftStatus {
  OPEN
  HIRED
  CANCELLED
}

enum ApplicationStatus {
  APPLIED
  WITHDRAWN
  REJECTED
  HIRED
}

model User {
  id        String         @id @default(cuid())
  name      String
  email     String         @unique
  // role     String?       // Not necessary for this exercise
  applications Application[]
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt
}

model Shift {
  id              String         @id @default(cuid())
  title           String
  description     String?
  facilityName    String
  location        String?
  startsAt        DateTime
  endsAt          DateTime
  hourlyRateCents Int
  status          ShiftStatus    @default(OPEN)
  hiredProviderId String?        // references a User if HIRED
  applications    Application[]
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}

model Application {
  id        String            @id @default(cuid())
  shiftId   String
  userId    String
  status    ApplicationStatus @default(APPLIED)
  createdAt DateTime          @default(now())

  shift     Shift   @relation(fields: [shiftId], references: [id])
  user      User    @relation(fields: [userId], references: [id])

  @@unique([shiftId, userId]) // prevent duplicates
}

```

## Explanation

### To start the project

```
cd ./shiftrx-take-home
bun install
bunx prisma db push
bun prisma/seed.ts
```

### Quick User Flow

The application has a seed file and uses a sqlite databse to make it easier to test quickly.

At the start of the application the app will load the first user from the list and set it to localStorage, that's the way I implemented an auth for easier and faster development on the core needs for the assignment.

Once loaded, the user finds a dashboard with upcoming and available shifts to either cancel, apply, withdraw the application or see more details about it.

On the right of the screen there is a sidebar so the user can go to any page they want.

On the **Shifts** page the user can see all the shifts to which he/she applied, it's done with a data table with the sorting and filtering. I tried doing the filtering sheet to include as many possible filters as the developer feels like, while also being easy to develop with, one should only change the filter items const and it should all adapt to those changes.

On the **My shifts** page the user will see a table of all the shifts assigned to him while also being able to sort and filter them

On the **Applications** page the user can see a table of all the shifts he applied to.

For the point 4 of the challenge the endpoint was tested with

```
curl -X POST http://localhost:3000/api/applications/hire -H "Content-Type: application/json" -d '{"applicationId":"cmh28klkz000b1fiv4lh41d1p","shiftId":"cmh28klkw00041fivsgynwl3s"}'
```

Feel free to test it too.

### Choices

On the backend I chose `trpc` for easier development and type safety, I prioritize that when developing because in the long run it's faster and easier to onboard a coworker; it also provides an easy approach for optimistic updates, which was something to keep in mind. For the database I chose `sqlite` just because it was easier to setup and did not require to start any database server as `MySQL` or `postgresql` would have

I started developing with a component library called **shadcn/ui** for a faster development, I thought the real core of the exercise was on the business logic and the correct handling of data and queries, but didn't want the page to look bad either, that's where components as `app-sidebar` comes from.

For the table I thought using `@tanstack/react-table` was the way to go, but only because of the simplicity it brings and the experience I have with it, I have also worked with `material-ui` tables and did not find any inconvenience. It was just that I had already developed a lot with it and did not want to miss any time reading a lot of docs
