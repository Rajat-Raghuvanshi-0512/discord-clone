import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: any,
  { params }: { params: { messageId: string } }
) {
  try {
    const profile = await currentProfile();
    const { messageId } = params;
    const { content } = await req.json();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get('serverId');
    const channelId = searchParams.get('channelId');
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!channelId) {
      return new NextResponse('No channel Id', { status: 400 });
    }
    if (!serverId) {
      return new NextResponse('No server Id', { status: 400 });
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

    let message = await db.message.findFirst({
      where: {
        id: messageId,
        channelId,
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
    message = await db.message.update({
      where: { id: message.id },
      data: { content },
      include: { member: { include: { profile: true } } },
    });

    const updateKey = `chat:${channelId}:message:update`;
    (req as any)?.io?.emit(updateKey, message);

    return NextResponse.json(message);
  } catch (error) {
    console.log('[MESSAGE_ID_PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const profile = await currentProfile();
    const { messageId } = params;
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get('serverId');
    const channelId = searchParams.get('channelId');
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!channelId) {
      return new NextResponse('No channel Id', { status: 400 });
    }
    if (!serverId) {
      return new NextResponse('No server Id', { status: 400 });
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

    let message = await db.message.findFirst({
      where: {
        id: messageId,
        channelId,
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
    message = await db.message.update({
      where: { id: message.id },
      data: { content: 'This message has been deleted', deleted: true },
      include: { member: { include: { profile: true } } },
    });
    return NextResponse.json(message);
  } catch (error) {
    console.log('[MESSAGE_ID_PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
