import { prisma } from '../lib/prisma';
import ToggleBar from '../components/ToogleBar';

export async function getMenus() {
  const menus = await prisma.menu.findMany();
  return menus;
}

export default async function Home() {
  const menus : any = await getMenus();

  return (
    <>
      <ToggleBar menus={menus} />
      <div className='ml-60'>
      </div>
    </>
  );
}
