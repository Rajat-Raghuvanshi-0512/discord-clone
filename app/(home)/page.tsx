import InitialModal from '@/components/modals/InitialModal';
import { ModeToggle } from '@/components/toggle-theme';
import { db } from '@/lib/db';
import { initialProfile } from '@/lib/initial-profile';
import { UserButton } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function Home() {
  const profile = await initialProfile();
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (server) {
    return redirect(`/servers/${server.id}`);
  }
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
      <InitialModal />
    </div>
  );
}
