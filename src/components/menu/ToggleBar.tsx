import { Menu } from '@prisma/client';

import Link from 'next/link';

import clsx from 'clsx';

import NewMenus from './NewMenu';
import UserModal from '../user/userModal';

type ToggleBarProps = {
  menus: Menu[];
}

export const ToggleBar = ({ menus }: ToggleBarProps) => {
  return (
    <div
      className={clsx(
        'bg-bg transition-colors duration-300',
        'md:fixed md:m-0 md:w-60 md:z-20 md:border-r-[1px]',
        'md:border-r-main md:p-0 md:-mt-[1px] md:h-[calc(100vh_+_1px)]'
      )}
    >
      <div className='p-4 flex flex-col gap-2'>
        <NewMenus />
        <div
          className={clsx(
            "flex flex-col gap-5 w-full md:h-full",
            "overflow-y-auto"
          )}
        >
          <div className='flex flex-col gap-2'>
            {menus.map((menu) => (
              <Link href={`/menu/${menu.name}`} key={menu.id} className='p-2 rounded-lg hover:bg-main transition-all duration-300'>
                {menu.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className='absolute bottom-0 p-3 border-t-[1px] border-t-main w-full z-40'>
        <UserModal />
      </div>
    </div>
  );
};

export default ToggleBar;
