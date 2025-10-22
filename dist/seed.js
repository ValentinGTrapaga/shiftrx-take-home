"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./generated/prisma");
const prisma = new prisma_1.PrismaClient();
async function main() {
    // Create 4 users
    const user1 = await prisma.user.create({
        data: {
            name: "María González",
            email: "maria.gonzalez@email.com",
        },
    });
    const user2 = await prisma.user.create({
        data: {
            name: "Carlos Rodríguez",
            email: "carlos.rodriguez@email.com",
        },
    });
    const user3 = await prisma.user.create({
        data: {
            name: "Ana Martínez",
            email: "ana.martinez@email.com",
        },
    });
    const user4 = await prisma.user.create({
        data: {
            name: "David López",
            email: "david.lopez@email.com",
        },
    });
    // Create multiple shifts with different statuses
    const shift1 = await prisma.shift.create({
        data: {
            title: "Enfermera Urgencias - Turno Noche",
            description: "Turno de 12 horas en urgencias. Experiencia en emergencias requerida.",
            facilityName: "Hospital General Central",
            location: "Madrid Centro",
            startsAt: new Date("2024-01-15T22:00:00Z"), // January 15, 2024, 10 PM
            endsAt: new Date("2024-01-16T10:00:00Z"), // January 16, 2024, 10 AM
            hourlyRateCents: 4500, // €45/hour
            status: prisma_1.ShiftStatus.OPEN,
        },
    });
    const shift2 = await prisma.shift.create({
        data: {
            title: "Técnico Radiología - Turno Mañana",
            description: "Realización de radiografías y mantenimiento de equipo.",
            facilityName: "Clínica San Rafael",
            location: "Barcelona",
            startsAt: new Date("2024-01-16T08:00:00Z"),
            endsAt: new Date("2024-01-16T16:00:00Z"),
            hourlyRateCents: 3800, // €38/hour
            status: prisma_1.ShiftStatus.HIRED,
            hiredProviderId: user2.id,
        },
    });
    const shift3 = await prisma.shift.create({
        data: {
            title: "Auxiliar de Enfermería - Turno Tarde",
            description: "Apoyo en cuidados básicos y administración de medicamentos.",
            facilityName: "Residencia de Ancianos La Paz",
            location: "Valencia",
            startsAt: new Date("2024-01-16T14:00:00Z"),
            endsAt: new Date("2024-01-16T22:00:00Z"),
            hourlyRateCents: 2800, // €28/hour
            status: prisma_1.ShiftStatus.CANCELLED,
        },
    });
    const shift4 = await prisma.shift.create({
        data: {
            title: "Fisioterapeuta - Sesiones Individuales",
            description: "Tratamientos de rehabilitación para pacientes post-operatorios.",
            facilityName: "Centro de Rehabilitación Norte",
            location: "Sevilla",
            startsAt: new Date("2024-01-17T09:00:00Z"),
            endsAt: new Date("2024-01-17T17:00:00Z"),
            hourlyRateCents: 4200, // €42/hour
            status: prisma_1.ShiftStatus.OPEN,
        },
    });
    const shift5 = await prisma.shift.create({
        data: {
            title: "Enfermera UCI - Turno Noche",
            description: "Cuidados intensivos. Experiencia mínima 3 años requerida.",
            facilityName: "Hospital Universitario",
            location: "Madrid Norte",
            startsAt: new Date("2024-01-17T21:00:00Z"),
            endsAt: new Date("2024-01-18T09:00:00Z"),
            hourlyRateCents: 5200, // €52/hour
            status: prisma_1.ShiftStatus.HIRED,
            hiredProviderId: user1.id,
        },
    });
    const shift6 = await prisma.shift.create({
        data: {
            title: "Técnico Laboratorio - Turno Mañana",
            description: "Análisis clínicos y procesamiento de muestras.",
            facilityName: "Laboratorio Clínico Central",
            location: "Bilbao",
            startsAt: new Date("2024-01-18T07:30:00Z"),
            endsAt: new Date("2024-01-18T15:30:00Z"),
            hourlyRateCents: 3500, // €35/hour
            status: prisma_1.ShiftStatus.OPEN,
        },
    });
    // Create applications with different statuses
    // Shift 1 (OPEN) - Multiple applications
    await prisma.application.create({
        data: {
            shiftId: shift1.id,
            userId: user1.id,
            status: prisma_1.ApplicationStatus.APPLIED,
        },
    });
    await prisma.application.create({
        data: {
            shiftId: shift1.id,
            userId: user3.id,
            status: prisma_1.ApplicationStatus.APPLIED,
        },
    });
    // Shift 2 (HIRED) - Carlos was hired, others applied and were rejected
    await prisma.application.create({
        data: {
            shiftId: shift2.id,
            userId: user2.id,
            status: prisma_1.ApplicationStatus.HIRED,
        },
    });
    await prisma.application.create({
        data: {
            shiftId: shift2.id,
            userId: user4.id,
            status: prisma_1.ApplicationStatus.REJECTED,
        },
    });
    // Shift 3 (CANCELLED) - Applications withdrawn due to cancellation
    await prisma.application.create({
        data: {
            shiftId: shift3.id,
            userId: user1.id,
            status: prisma_1.ApplicationStatus.WITHDRAWN,
        },
    });
    await prisma.application.create({
        data: {
            shiftId: shift3.id,
            userId: user2.id,
            status: prisma_1.ApplicationStatus.WITHDRAWN,
        },
    });
    // Shift 4 (OPEN) - One application
    await prisma.application.create({
        data: {
            shiftId: shift4.id,
            userId: user4.id,
            status: prisma_1.ApplicationStatus.APPLIED,
        },
    });
    // Shift 5 (HIRED) - María was hired, Ana was rejected
    await prisma.application.create({
        data: {
            shiftId: shift5.id,
            userId: user1.id,
            status: prisma_1.ApplicationStatus.HIRED,
        },
    });
    await prisma.application.create({
        data: {
            shiftId: shift5.id,
            userId: user3.id,
            status: prisma_1.ApplicationStatus.REJECTED,
        },
    });
    // Shift 6 (OPEN) - Multiple applications
    await prisma.application.create({
        data: {
            shiftId: shift6.id,
            userId: user2.id,
            status: prisma_1.ApplicationStatus.APPLIED,
        },
    });
    await prisma.application.create({
        data: {
            shiftId: shift6.id,
            userId: user3.id,
            status: prisma_1.ApplicationStatus.APPLIED,
        },
    });
    await prisma.application.create({
        data: {
            shiftId: shift6.id,
            userId: user4.id,
            status: prisma_1.ApplicationStatus.APPLIED,
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
