import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

import { Prisma, User } from "@prisma/client"

import { createNewRow } from "../serverless/createNewRow"

import { zodResolver } from "@hookform/resolvers/zod"

import { FieldValues, useForm } from "react-hook-form"

import { z } from "zod"

import Swal from "sweetalert2"
import { useAuth } from "@/context/AuthContext"
import { TableDataType } from "@/app/menu/[menu]/page"

type newColumnType = {
    open: boolean,
    setOpen: (open: boolean) => void,
    menuId: string,
    handleAddLine: ({ newRowData, newRowUser }: {
        newRowData: {
            [key: string]: string;
        };
        newRowUser: User;
    }) => void
    tableData: TableDataType
}

export const NewRow = ({ open, setOpen, menuId, handleAddLine, tableData } : newColumnType) => {
    const createNewRowSchema = (columns: Prisma.JsonValue | null) => {
        if (!columns) return z.object({});
        
        const schemaShape = Object.values(columns).reduce((acc, column) => {
            acc[column] = z.string().nonempty(`O campo ${column} é obrigatório`);
            return acc;
        }, {} as Record<string, z.ZodString>);
        
        return z.object(schemaShape);
    };
    
    const newRowSchema = createNewRowSchema(tableData.columns);

    const auth = useAuth();
    const user = auth?.user;

    const {
        register,
        handleSubmit,
    } = useForm({
        resolver: zodResolver(newRowSchema),
    });

    const handleAddRow = async (data: FieldValues) => {
        try {
            if (!user) {
                Swal.fire('Atenção', 'Você precisa estar logado para adicionar uma linha', 'warning');
                return;
            }

            await createNewRow(menuId, user.id, data);

            handleAddLine({
                newRowData: data as { [key: string]: string },
                newRowUser: user,
            });
            setOpen(false);
        }
        catch (error) {
            Swal.fire('Erro', 'Ocorreu um erro ao adicionar a linha', 'error')
            console.log(error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogContent className='bg-bg text-text border-main border-2'>
                <DialogHeader>
                    <DialogTitle className='mb-3'>Crie uma linha nova!</DialogTitle>
                    <form onSubmit={handleSubmit(handleAddRow)} className="flex flex-col gap-3">
                        {tableData.columns && Object.values(tableData.columns).map((column, index) => (
                            <div key={index}>
                                <Input
                                    placeholder={column}
                                    {...register(column)}
                                    className='p-2 border rounded'
                                />
                            </div>
                        ))}
                        <Button type="submit" className="mt-2">Adicionar Linha</Button>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}