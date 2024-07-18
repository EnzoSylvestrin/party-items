import ToggleBar from '../components/menu/ToggleBar';
import { getMenus } from '../components/serverless/getMenus';

export default async function Home() {
  let menus : any = await getMenus();

  return (
    <>
      <ToggleBar menus={menus} />
      <div className='ml-60'>
        <div className='w-full h-[100vh] text-6xl flex items-center justify-center'>
          Selecione um item para ver!
        </div>
      </div>
    </>
  );
}
