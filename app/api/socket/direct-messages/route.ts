import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { content, fileUrl } = await req.json();
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!conversationId) {
      return new NextResponse('Conversation Id not found', { status: 400 });
    }
    if (!content) {
      return new NextResponse('Content not found', { status: 400 });
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

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${conversationId}:messages`;
    (req as any)?.io?.emit(channelKey, message);
    return NextResponse.json(message);
  } catch (error) {
    console.log('[IO_DIRECT_MESSAGES_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
