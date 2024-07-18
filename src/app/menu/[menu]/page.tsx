import ToggleBar from '@/components/ToogleBar';
import { prisma } from '../../../lib/prisma';
import { getMenus } from '@/app/menu';

export async function generateStaticParams() {
  const menus = await prisma.menu.findMany();
  return menus.map(menu => ({
    menu: menu.name,
  }));
}

async function getMenuData(menuName: string) {
  const menu = await prisma.menu.findUnique({
    where: { name: menuName },
    include: { items: true },
  });
  return menu;
}

export default async function MenuPage({ params } : { params: any }) {
  const menu = await getMenuData(params.menu);

  const menus : any = await getMenus();

  return (
    <>
      <ToggleBar menus={menus} />
      <div className='ml-60'>
        <h1>{menu?.name}</h1>
        <ul>
          {menu?.items.map((item) => (
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
