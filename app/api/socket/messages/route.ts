import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { content, fileUrl } = await req.json();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get('serverId');
    const channelId = searchParams.get('channelId');
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!serverId) {
      return new NextResponse('Server id not found', { status: 400 });
    }
    if (!channelId) {
      return new NextResponse('Channel id not found', { status: 400 });
    }
    if (!content) {
      return new NextResponse('Content not found', { status: 400 });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return new NextResponse('Server not found', { status: 404 });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId,
        serverId,
      },
    });

    if (!channel) {
      return new NextResponse('Channel not found', { status: 404 });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );
    if (!member) {
      return new NextResponse('Member not found', { status: 404 });
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId,
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

    return NextResponse.json(message);
  } catch (error) {
    console.log('[IO_MESSAGES_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
