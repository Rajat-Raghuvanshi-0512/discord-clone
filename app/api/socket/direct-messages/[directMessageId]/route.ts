import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { directMessageId: string } }
) {
  try {
    const profile = await currentProfile();
    const { directMessageId } = params;
    const { content } = await req.json();
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!conversationId) {
      return new NextResponse('No conversation Id', { status: 400 });
    }
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation) {
      return new NextResponse('Conversation not found', { status: 404 });
    }

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;
    if (!member) {
      return new NextResponse('Member not found', { status: 404 });
    }

    let message = await db.directMessage.findFirst({
      where: {
        id: directMessageId,
        conversationId,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!message || message.deleted) {
      return new NextResponse('Message not found', { status: 404 });
    }

    const isMessageOwner = message.memberId === member.id;
    if (!isMessageOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    message = await db.directMessage.update({
      where: { id: message.id },
      data: { content },
      include: { member: { include: { profile: true } } },
    });

    const updateKey = `chat:${conversationId}:message:update`;
    (req as any)?.io?.emit(updateKey, message);

    return NextResponse.json(message);
  } catch (error) {
    console.log('[MESSAGE_ID_PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { directMessageId: string } }
) {
  try {
    const profile = await currentProfile();
    const { directMessageId } = params;
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!conversationId) {
      return new NextResponse('No conversation Id', { status: 400 });
    }
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation) {
      return new NextResponse('Conversation not found', { status: 404 });
    }

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;
    if (!member) {
      return new NextResponse('Member not found', { status: 404 });
    }

    let message = await db.directMessage.findFirst({
      where: {
        id: directMessageId,
        conversationId,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!message || message.deleted) {
      return new NextResponse('Message not found', { status: 404 });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;
    if (!canModify) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    message = await db.directMessage.update({
      where: { id: message.id },
      data: { content: 'This message has been deleted', deleted: true },
      include: { member: { include: { profile: true } } },
    });

    const updateKey = `chat:${conversationId}:message:update`;
    (req as any)?.io?.emit(updateKey, message);
    return NextResponse.json(message);
  } catch (error) {
    console.log('[MESSAGE_ID_PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
