'use client';

import { useEffect, useState } from 'react';

import { Menu } from '@prisma/client';
import ToggleBar from '../components/menu/ToggleBar';

import { getMenus } from '../components/serverless/getMenus';

export default function Home() {
  const [menus, setMenus] = useState<Menu[]>([]);

  async function loadMenus() {
    let menus : any = await getMenus();

    setMenus(menus);
  }

  useEffect(() => {
    loadMenus();
  }, []);

  return (
    <>
      <ToggleBar menus={menus} refresh={loadMenus} />
      <div className='ml-60'>
        <div className='w-full h-[100vh] text-6xl flex items-center justify-center'>
          Selecione um item para ver!
        </div>
      </div>
    </>
  );
}
