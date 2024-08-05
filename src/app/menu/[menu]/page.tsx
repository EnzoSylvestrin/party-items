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

import { Menu, Prisma } from '@prisma/client';

export default function MenuPage({ params }: { params: any }) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [menu, setMenu] = useState<any | null>(null);
  const [tableData, setTableData] = useState<{ columns: Prisma.JsonValue | null, rows: { [key: string]: string }[] }>({ columns: null, rows: [] });

  const [openColumnDialog, setOpenColumnDialog] = useState(false);
  const [openRowDialog, setOpenRowDialog] = useState(false);

  const router = useRouter();

  const auth = useAuth();
  const isUserLogged = auth?.isUserLogged();

  async function loadMenus() {
    let menus = await getMenus();
    setMenus(menus);
  }

  console.log(tableData);

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
        rows: menu.Table.rows.map(row => row.data as { [key: string]: string }),
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

  const handleAddRow = (newRow: { [key: string]: string }) => {
    setTableData((prev) => ({
      ...prev,
      rows: [...prev.rows, newRow],
    }));
  };

  const validateUserisLogged = (errorMessage: string) => {
    if (!isUserLogged) {
      Swal.fire('Atenção', errorMessage, 'warning');
      return;
    }
  }

  const handleOpenRowDialog = () => {
    validateUserisLogged('Você precisa estar logado para adicionar uma linha.');

    setOpenRowDialog(true);
  }

  const handleOpenColumnDialog = () => {
    validateUserisLogged('Você precisa estar logado para adicionar uma coluna.');

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
                <TableRow key={rowIndex}>
                  {tableData.columns && Object.values(tableData.columns).map((column, colIndex) => (
                    <TableCell key={colIndex}>{row[column]}</TableCell>
                  ))}
                  {(tableData.columns && Object.keys(tableData.columns).length < 6) && <TableCell></TableCell>}
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={Object.keys(tableData.columns ?? {}).length + 1} className='cursor-pointer' onClick={handleOpenRowDialog}>+</TableCell>
              </TableRow>
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
