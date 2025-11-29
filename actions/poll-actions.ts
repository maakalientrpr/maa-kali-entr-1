"use server";

import { auth } from "@/lib/auth";
import { requireAdmin, requireAuth } from "@/lib/auth-utils";
import prisma from "@/lib/db";
import { PollStatus } from "@/prisma/generated/enums";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

// Define a strict return type for your actions
type PollActionResponse =
  | { success: true; message: string; error?: undefined }
  | { success: false; error: string; message?: undefined };

// --- ADMIN: Create a Poll ---
export async function createPoll(
  formData: FormData
): Promise<PollActionResponse> {
  await requireAdmin();
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  // 1. Check Auth & Role
  if (session?.user?.role !== "admin") {
    // DO NOT use NextResponse.json() here. Just return a plain object.
    return { success: false, error: "Unauthorized: Admins only" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!title || !description || !location) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    await prisma.proposedTour.create({
      data: {
        title,
        description,
        location,
        imageUrl: imageUrl || null,
      },
    });

    revalidatePath("/polls");
    return { success: true, message: "Poll created successfully" };
  } catch (error) {
    console.error("Create Poll Error:", error);
    return { success: false, error: "Failed to create poll" };
  }
}

// --- USER: Vote (Toggle) ---
export async function toggleVote(pollId: string): Promise<PollActionResponse> {
  await requireAuth();
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, error: "You must be logged in to vote" };
  }

  try {

    const poll = await prisma.proposedTour.findUnique({
        where: {id: pollId},
        select: {status: true},
    });

    if(!poll){
        return {success: false, error: 'Poll not found'}
    }

    if(poll.status !== 'OPEN'){
        return {
            success: false,
            error: `Voting is currently ${poll.status.toLowerCase()} for this trip`
        }
    }
    // Check if vote exists
    const existingVote = await prisma.tourVote.findUnique({
      where: {
        userId_proposedTourId: {
          userId,
          proposedTourId: pollId,
        },
      },
    });

    if (existingVote) {
      // Remove vote
      await prisma.tourVote.delete({
        where: { id: existingVote.id },
      });
      revalidatePath("/vote");
      return { success: true, message: "Vote removed" };
    } else {
      // Add vote
      await prisma.tourVote.create({
        data: {
          userId,
          proposedTourId: pollId,
        },
      });
      revalidatePath("/polls");
      return { success: true, message: "Vote added" };
    }
  } catch (error) {
    console.error("Vote Error:", error);
    return { success: false, error: "Something went wrong" };
  }
}

// --- FETCHING ---
// Note: This function returns data, not the Response object type above.
export async function getPolls() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  const currentUserId = session?.user?.id;

  const polls = await prisma.proposedTour.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { votes: true },
      },
      votes: currentUserId
        ? {
            where: { userId: currentUserId },
            select: { id: true },
          }
        : false,
    },
  });

  return polls.map((poll) => ({
    ...poll,
    voteCount: poll._count.votes,
    hasVoted: poll.votes?.length > 0,
  }));
}

export async function deletePoll(pollId: string): Promise<PollActionResponse> {
  await requireAdmin();

  try {
    await prisma.proposedTour.delete({
      where: { id: pollId },
    });
    revalidatePath("/vote");
    revalidatePath("/admin/vote");
    return { success: true, message: "Poll deleted successfully" };
  } catch (error) {
    return { success: false, error: "Failed to delete poll" };
  }
}

export async function updatePollStatus(
  pollId: string,
  status: PollStatus
): Promise<PollActionResponse> {
  await requireAdmin();

  try {
    await prisma.proposedTour.update({
      where: { id: pollId },
      data: { status },
    });
    revalidatePath("/polls");
    revalidatePath("/admin/polls");
    return { success: true, message: "Status updated" };
  } catch (error) {
    return { success: false, error: "Failed to update status" };
  }
}
