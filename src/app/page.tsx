import ToggleBar from '../components/menu/ToogleBar';
import { getMenus } from '../components/serverless/getMenus';

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
