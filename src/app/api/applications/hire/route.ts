import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { ApplicationStatus, ShiftStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const { applicationId, shiftId } = await request.json();

    if (!applicationId || !shiftId) {
      return NextResponse.json(
        { error: "applicationId and shiftId are required" },
        { status: 400 },
      );
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        shift: true,
        user: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    if (application.shiftId !== shiftId) {
      return NextResponse.json(
        { error: "Application does not belong to the specified shift" },
        { status: 400 },
      );
    }

    if (application.shift.status === ShiftStatus.HIRED) {
      return NextResponse.json(
        { error: "Shift is already hired" },
        { status: 400 },
      );
    }

    if (application.shift.status === ShiftStatus.CANCELLED) {
      return NextResponse.json(
        { error: "Cannot hire for a cancelled shift" },
        { status: 400 },
      );
    }

    if (application.status !== ApplicationStatus.APPLIED) {
      return NextResponse.json(
        { error: "Application is not in APPLIED status" },
        { status: 400 },
      );
    }

    const otherApplications = await prisma.application.findMany({
      where: {
        shiftId,
        id: { not: applicationId },
        status: ApplicationStatus.APPLIED,
      },
      select: {
        id: true,
      },
    });

    await Promise.all([
      prisma.application.updateMany({
        where: {
          id: { in: otherApplications.map((app) => app.id) },
        },
        data: { status: ApplicationStatus.REJECTED },
      }),
      prisma.shift.update({
        where: { id: shiftId },
        data: {
          status: ShiftStatus.HIRED,
          hiredProviderId: application.userId,
        },
      }),
      prisma.application.update({
        where: { id: applicationId },
        data: { status: ApplicationStatus.HIRED },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Provider hired successfully",
      data: {
        applicationId,
        shiftId,
        hiredUserId: application.userId,
        hiredUserName: application.user.name,
      },
    });
  } catch (error) {
    console.error("Error hiring provider:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
