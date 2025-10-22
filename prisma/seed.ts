import {
  PrismaClient,
  ShiftStatus,
  ApplicationStatus,
} from "./generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Create 4 users
  const user1 = await prisma.user.create({
    data: {
      name: "Maria Gonzalez",
      email: "maria.gonzalez@email.com",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Carlos Rodriguez",
      email: "carlos.rodriguez@email.com",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: "Ana Martinez",
      email: "ana.martinez@email.com",
    },
  });

  const user4 = await prisma.user.create({
    data: {
      name: "David Lopez",
      email: "david.lopez@email.com",
    },
  });

  // Create multiple shifts with different statuses
  const shift1 = await prisma.shift.create({
    data: {
      title: "Emergency Nurse - Night Shift",
      description:
        "12-hour shift in emergency department. Emergency experience required.",
      facilityName: "Central General Hospital",
      location: "Madrid Center",
      startsAt: new Date("2024-01-15T22:00:00Z"), // January 15, 2024, 10 PM
      endsAt: new Date("2024-01-16T10:00:00Z"), // January 16, 2024, 10 AM
      hourlyRateCents: 4500, // €45/hour
      status: ShiftStatus.OPEN,
    },
  });

  const shift2 = await prisma.shift.create({
    data: {
      title: "Radiology Technician - Morning Shift",
      description: "Performing X-rays and equipment maintenance.",
      facilityName: "San Rafael Clinic",
      location: "Barcelona",
      startsAt: new Date("2024-01-16T08:00:00Z"),
      endsAt: new Date("2024-01-16T16:00:00Z"),
      hourlyRateCents: 3800, // €38/hour
      status: ShiftStatus.HIRED,
      hiredProviderId: user2.id,
    },
  });

  const shift3 = await prisma.shift.create({
    data: {
      title: "Nursing Assistant - Afternoon Shift",
      description: "Support in basic care and medication administration.",
      facilityName: "La Paz Nursing Home",
      location: "Valencia",
      startsAt: new Date("2024-01-16T14:00:00Z"),
      endsAt: new Date("2024-01-16T22:00:00Z"),
      hourlyRateCents: 2800, // €28/hour
      status: ShiftStatus.CANCELLED,
    },
  });

  const shift4 = await prisma.shift.create({
    data: {
      title: "Physiotherapist - Individual Sessions",
      description: "Rehabilitation treatments for post-operative patients.",
      facilityName: "North Rehabilitation Center",
      location: "Seville",
      startsAt: new Date("2024-01-17T09:00:00Z"),
      endsAt: new Date("2024-01-17T17:00:00Z"),
      hourlyRateCents: 4200, // €42/hour
      status: ShiftStatus.OPEN,
    },
  });

  const shift5 = await prisma.shift.create({
    data: {
      title: "ICU Nurse - Night Shift",
      description: "Intensive care. Minimum 3 years experience required.",
      facilityName: "University Hospital",
      location: "North Madrid",
      startsAt: new Date("2024-01-17T21:00:00Z"),
      endsAt: new Date("2024-01-18T09:00:00Z"),
      hourlyRateCents: 5200, // €52/hour
      status: ShiftStatus.HIRED,
      hiredProviderId: user1.id,
    },
  });

  const shift6 = await prisma.shift.create({
    data: {
      title: "Laboratory Technician - Morning Shift",
      description: "Clinical analysis and sample processing.",
      facilityName: "Central Clinical Laboratory",
      location: "Bilbao",
      startsAt: new Date("2024-01-18T07:30:00Z"),
      endsAt: new Date("2024-01-18T15:30:00Z"),
      hourlyRateCents: 3500, // €35/hour
      status: ShiftStatus.OPEN,
    },
  });

  // Create applications with different statuses
  // Shift 1 (OPEN) - Multiple applications
  await prisma.application.create({
    data: {
      shiftId: shift1.id,
      userId: user1.id,
      status: ApplicationStatus.APPLIED,
    },
  });

  await prisma.application.create({
    data: {
      shiftId: shift1.id,
      userId: user3.id,
      status: ApplicationStatus.APPLIED,
    },
  });

  // Shift 2 (HIRED) - Carlos was hired, others applied and were rejected
  await prisma.application.create({
    data: {
      shiftId: shift2.id,
      userId: user2.id,
      status: ApplicationStatus.HIRED,
    },
  });

  await prisma.application.create({
    data: {
      shiftId: shift2.id,
      userId: user4.id,
      status: ApplicationStatus.REJECTED,
    },
  });

  // Shift 3 (CANCELLED) - Applications withdrawn due to cancellation
  await prisma.application.create({
    data: {
      shiftId: shift3.id,
      userId: user1.id,
      status: ApplicationStatus.WITHDRAWN,
    },
  });

  await prisma.application.create({
    data: {
      shiftId: shift3.id,
      userId: user2.id,
      status: ApplicationStatus.WITHDRAWN,
    },
  });

  // Shift 4 (OPEN) - Multiple applications
  await prisma.application.create({
    data: {
      shiftId: shift4.id,
      userId: user4.id,
      status: ApplicationStatus.APPLIED,
    },
  });

  // Shift 5 (HIRED) - Maria was hired, Ana was rejected
  await prisma.application.create({
    data: {
      shiftId: shift5.id,
      userId: user1.id,
      status: ApplicationStatus.HIRED,
    },
  });

  await prisma.application.create({
    data: {
      shiftId: shift5.id,
      userId: user3.id,
      status: ApplicationStatus.REJECTED,
    },
  });

  // Shift 6 (OPEN) - Multiple applications
  await prisma.application.create({
    data: {
      shiftId: shift6.id,
      userId: user2.id,
      status: ApplicationStatus.APPLIED,
    },
  });

  await prisma.application.create({
    data: {
      shiftId: shift6.id,
      userId: user3.id,
      status: ApplicationStatus.APPLIED,
    },
  });

  await prisma.application.create({
    data: {
      shiftId: shift6.id,
      userId: user4.id,
      status: ApplicationStatus.APPLIED,
    },
  });

  // Additional applications to reach 6 more total
  await prisma.application.create({
    data: {
      shiftId: shift1.id,
      userId: user2.id,
      status: ApplicationStatus.APPLIED,
    },
  });

  await prisma.application.create({
    data: {
      shiftId: shift1.id,
      userId: user4.id,
      status: ApplicationStatus.APPLIED,
    },
  });

  await prisma.application.create({
    data: {
      shiftId: shift4.id,
      userId: user1.id,
      status: ApplicationStatus.APPLIED,
    },
  });

  await prisma.application.create({
    data: {
      shiftId: shift4.id,
      userId: user2.id,
      status: ApplicationStatus.APPLIED,
    },
  });

  await prisma.application.create({
    data: {
      shiftId: shift4.id,
      userId: user3.id,
      status: ApplicationStatus.APPLIED,
    },
  });

  await prisma.application.create({
    data: {
      shiftId: shift6.id,
      userId: user1.id,
      status: ApplicationStatus.APPLIED,
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
