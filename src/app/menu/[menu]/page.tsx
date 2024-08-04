'use client';

import { useState, useEffect } from 'react';

import ToggleBar from '@/components/menu/ToggleBar';
import { getMenus } from '@/components/serverless/getMenus';

import { Menu } from '@prisma/client';

import { getMenuData } from '../../../components/serverless/getMenuData';

export default function MenuPage({ params } : { params: any }) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [menu, setMenu] = useState<any | null>(null);

  async function loadMenus() {
    let menus = await getMenus();

    setMenus(menus);
  }

  async function loadMenu(menuId: string) {
    const menu = await getMenuData(menuId);

    setMenu(menu);
  }

  useEffect(() => {
    loadMenus();
    loadMenu(params.menu);
  }, [params.menu]);

  return (
    <>
      <ToggleBar menus={menus} refresh={loadMenus} />
      <div className='ml-60'>
        <h1>{menu?.name}</h1>
        <ul>
          {menu?.tables.map((item: any) => (
            <li key={item.id}>
              <h2>{item.name}</h2>
              <p>Price: {item.price}</p>
              <p>Quantity: {item.quantity}</p>
            </li>
          ))}
        </ul>
      </div> 
    </>
  );
}
