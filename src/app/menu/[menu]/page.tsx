import ToggleBar from '@/components/menu/ToggleBar';
import { getMenus } from '@/components/serverless/getMenus';

import { getMenuData } from '../../../components/serverless/getMenuData';

export default async function MenuPage({ params } : { params: any }) {
  const menu = await getMenuData(params.menu);

  const menus : any = await getMenus();

  return (
    <>
      <ToggleBar menus={menus} />
      <div className='ml-60'>
        <h1>{menu?.name}</h1>
        <ul>
          {menu?.items.map((item: any) => (
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
