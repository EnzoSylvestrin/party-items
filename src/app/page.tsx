import ToggleBar from '../components/ToogleBar';
import { getMenus } from './getMenus';

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
