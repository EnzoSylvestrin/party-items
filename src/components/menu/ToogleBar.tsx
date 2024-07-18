'use client';

import { Menu } from '@prisma/client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import clsx from 'clsx';

import { useIsMedium } from '@/hooks/useMediaQuery';
import { DURATION_ANIMATION, ANIMATION_TYPE } from '@/utils/Constants';

import NewMenus from './NewMenu';
import UserModal from '../user/userModal';

export const ToggleBar = ({ menus }: { menus: Menu[] }) => {
  const IsMedium = useIsMedium();

  return (
    <motion.div
      className={clsx(
        'bg-bg transition-colors duration-300',
        'md:fixed md:m-0 md:w-60 md:z-20 md:border-r-[1px]',
        'md:border-r-main md:p-0 md:-mt-[1px] md:h-[calc(100vh_+_1px)]'
      )}
      transition={{
        duration: !IsMedium ? 0 : DURATION_ANIMATION,
        type: ANIMATION_TYPE,
      }}
    >
      <div className='p-4 flex flex-col gap-2'>
        <NewMenus />
        <div
          className={clsx(
            "flex flex-col gap-5 w-full md:h-full",
            "overflow-y-scroll"
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
    </motion.div>
  );
};

export default ToggleBar;
