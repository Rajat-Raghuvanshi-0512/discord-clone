import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { channelId } = params;
    const { name, type } = await req.json();
    const serverId = searchParams.get('serverId');
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!channelId) {
      return new NextResponse('No member Id', { status: 400 });
    }
    if (!serverId) {
      return new NextResponse('No channel Id', { status: 400 });
    }
    if (name === 'general') {
      return new NextResponse('Name cannot be general', { status: 403 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: params.channelId,
              name: {
                not: 'general',
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log('[Channel_ID_PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { channelId } = params;
    const serverId = searchParams.get('serverId');
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!channelId) {
      return new NextResponse('No member Id', { status: 400 });
    }
    if (!serverId) {
      return new NextResponse('No channel Id', { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
            name: {
              not: 'general',
            },
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log('[Channel_ID_DELETE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
