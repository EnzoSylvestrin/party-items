'use client';

import { useAuth } from '@/context/AuthContext';

import { Menu } from '@prisma/client';

import Link from 'next/link';

import clsx from 'clsx';

import NewMenus from './NewMenu';
import UserModal from '../user/userModal';

import { FaTrash } from "react-icons/fa";
import { CiLogout } from 'react-icons/ci';

import { Button } from '../ui/button';

import Swal from 'sweetalert2';

import { deleteMenu } from '../serverless/deleteMenu';

type ToggleBarProps = {
  menus: Menu[];
  refresh: () => Promise<void>;
}

export const ToggleBar = ({ menus, refresh }: ToggleBarProps) => {
  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout;

  const isUserLogged = user != null;

  const handleDeleteMenu = async (e: any, menuId: number) => {
    e.preventDefault();

    try {
      await deleteMenu(menuId);
      
      refresh();
    }
    catch (error: any) {
      Swal.fire('Erro', error.message, 'error');
      console.error(error);
    }
  }

  const handleLogout = () => {
    Swal.fire({
      title: "Deseja realmente sair?",
      showDenyButton: true,
      showCancelButton: true,
      showConfirmButton: false,
      focusCancel: true,
      denyButtonText: "Sair",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isDenied) {
        if (logout) {
          logout();
        }
      }
    })
  }

  return (
    <div
      className={clsx(
        'bg-bg transition-colors duration-300',
        'md:fixed md:m-0 md:w-60 md:z-20 md:border-r-[1px]',
        'md:border-r-main md:p-0 md:-mt-[1px] md:h-[calc(100vh_+_1px)]'
      )}
    >
      <div className='p-4 flex flex-col gap-4'>
        <NewMenus refresh={refresh} />
        <div
          className={clsx(
            "flex flex-col gap-5 w-full md:h-full",
            "overflow-y-auto"
          )}
        >
          <div className='flex flex-col gap-2'>
            {menus.map((menu) => (
              <Link href={`/menu/${menu.id}`} key={menu.id} className='p-2 rounded-lg hover:bg-main transition-all duration-300 relative'>
                {menu.name}
                {
                  user?.isAdmin && (
                    <Button variant='outline' className='absolute right-2 top-0 p-1' onClick={(e) => {
                      handleDeleteMenu(e, menu.id);
                    }}>
                      <FaTrash size={16} />
                    </Button>
                  ) 
                }
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className='absolute bottom-0 p-3 border-t-[1px] border-t-main w-full z-40'>
        {
          isUserLogged ? (
            <div className="flex items-center justify-between text-text">
              <p style={{ color: `${user.color}` }}>
                {user.name}
              </p>
              <Button className='p-2 bg-red-700 rounded-full hover:bg-red-600' onClick={handleLogout}>
                <CiLogout size={24} />
              </Button>
            </div>
          ) : (
            <UserModal />
          )
        }
      </div>
    </div>
  );
};

export default ToggleBar;
