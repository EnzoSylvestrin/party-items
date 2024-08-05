'use client';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import Swal from 'sweetalert2';

import ToggleBar from '@/components/menu/ToggleBar';
import { NewColumn } from '@/components/menu/NewColumn';
import { NewRow } from '@/components/menu/NewRow';

import { getMenus } from '@/components/serverless/getMenus';
import { getMenuData } from '@/components/serverless/getMenuData';

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { useAuth } from '@/context/AuthContext';

import { Menu, Prisma, User } from '@prisma/client';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

export type TableDataType = { 
  columns: Prisma.JsonValue | null, 
  rows: { 
    data: { 
      [key: string]: string 
    },
    user: User 
  }[]
}

export default function MenuPage({ params }: { params: any }) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [menu, setMenu] = useState<any | null>(null);
  const [tableData, setTableData] = useState<TableDataType>({ columns: null, rows: [] });

  const [openColumnDialog, setOpenColumnDialog] = useState(false);
  const [openRowDialog, setOpenRowDialog] = useState(false);

  const router = useRouter();

  const auth = useAuth();
  const isUserLogged = auth?.isUserLogged();

  async function loadMenus() {
    let menus = await getMenus();
    setMenus(menus);
  }

  async function loadMenu(menuId: string) {
    const menu = await getMenuData(menuId);

    if (!menu) {
      Swal.fire('Erro', 'Esse menu não foi encontrado!', 'error');
      router.push('/');
    }

    setMenu(menu);
    if (menu && menu.Table) {
      setTableData({
        columns: menu.Table.columns,
        rows: menu.Table.rows.map(row => ({
          data: row.data as { [key: string]: string },
          user: row.user,
        })),
      });
    }
  }

  useEffect(() => {
    loadMenus();
    loadMenu(params.menu);
  }, [params.menu]);

  const handleAddField = (newField: string) => {
    if ((tableData.columns && Object.keys(tableData.columns).length >= 6)) {
      Swal.fire('Atenção', 'O limite de campos é 6.', 'error');
      return;
    }

    const newColumnKey = `column${Object.keys(tableData.columns ?? {}).length + 1}`;
    setTableData((prev) => ({
      ...prev,
      columns: {
        ...(prev.columns as { [key: string]: string }),
        [newColumnKey]: newField,
      },
    }));
  };

  const handleAddRow = ({ newRowData, newRowUser } : { newRowData: { [key: string]: string }, newRowUser: User }) => {
    setTableData((prev) => ({
      ...prev,
      rows: [...prev.rows, { data: newRowData, user: newRowUser }],
    }));
  };

  const validateUserisLogged = (errorMessage: string) => {
    if (!isUserLogged) {
      Swal.fire('Atenção', errorMessage, 'warning');
      return false;
    }
    return true;
  }

  const handleOpenRowDialog = () => {
    const shouldContinue = validateUserisLogged('Você precisa estar logado para adicionar uma linha.');

    if (!shouldContinue) return;

    setOpenRowDialog(true);
  }

  const handleOpenColumnDialog = () => {
    const shouldContinue = validateUserisLogged('Você precisa estar logado para adicionar uma coluna.');

    if (!shouldContinue) return;

    setOpenColumnDialog(true);
  }

  return (
    <>
      <ToggleBar menus={menus} refresh={loadMenus} />
      <div className='ml-60'>
        <div className='w-full h-[100vh] flex flex-col justify-center items-center gap-6 p-16'>
          <h1 className='text-5xl text-start text-white self-start'>{menu?.name}</h1>
          <Table>
            <TableCaption className='text-white'>Adicione campos ou linhas a essa tabela!</TableCaption>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                {tableData.columns && Object.keys(tableData.columns).map((column, index) => (
                  <TableHead key={index}>{(tableData.columns as { [key: string]: string })[column]}</TableHead>
                ))}
                {(tableData.columns && Object.keys(tableData.columns).length < 6) && <TableHead className='cursor-pointer' onClick={handleOpenColumnDialog}>+</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.rows.map((row, rowIndex) => (
                <HoverCard key={rowIndex}>
                  <HoverCardTrigger asChild>
                    <TableRow>
                      {tableData.columns && Object.values(tableData.columns).map((column, colIndex) => (
                        <TableCell key={colIndex}>{row.data[column]}</TableCell>
                      ))}
                      {(tableData.columns && Object.keys(tableData.columns).length < 6) && <TableCell></TableCell>}
                    </TableRow>
                  </HoverCardTrigger>
                  <HoverCardContent className='w-80'>
                    <div className='rounded-lg flex items-center justify-between'>
                      <p className='text-sm'>Criado por: <span style={{ color: row.user.color }}>{row.user.name}</span></p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
              {
                tableData.columns && Object.keys(tableData.columns).length > 0 &&
                <TableRow>
                  <TableCell colSpan={Object.keys(tableData.columns ?? {}).length + 1} className='cursor-pointer' onClick={handleOpenRowDialog}>+</TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </div>
      </div>
      {openColumnDialog && ( 
        <NewColumn open={openColumnDialog} setOpen={setOpenColumnDialog} handleAddField={handleAddField} menuId={params.menu} />
      )}
      {openRowDialog && (
        <NewRow open={openRowDialog} setOpen={setOpenRowDialog} handleAddLine={handleAddRow} tableData={tableData} menuId={params.menu} />
      )}
    </>
  );
}
