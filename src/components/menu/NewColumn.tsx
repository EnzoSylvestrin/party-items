import { createNewColumn } from "../serverless/createNewColumn"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

import { zodResolver } from "@hookform/resolvers/zod"

import { FieldValues, useForm } from "react-hook-form"

import { z } from "zod"

import Swal from "sweetalert2"

type newColumnType = {
    open: boolean,
    setOpen: (open: boolean) => void,
    menuId: string,
    handleAddField: (newField: string) => void
}

const newColumnSchema = z.object({
    newColumn: z.string().min(1, "A coluna é obrigatória"),
});

export const NewColumn = ({ open, setOpen, menuId, handleAddField } : newColumnType) => {
    const {
        register,
        handleSubmit,
    } = useForm({
        resolver: zodResolver(newColumnSchema),
    });

    const handleAddColumn = async (data: FieldValues) => {
        try {
            const newColumn = await createNewColumn({ menuId, columnName: data.newColumn });

            if (!newColumn.success) {
                Swal.fire('Erro', 'Ocorreu um erro ao adicionar a coluna', 'error');
                return;
            }

            handleAddField(data.newColumn);
            setOpen(false);
        }
        catch (error) {
            Swal.fire('Erro', 'Ocorreu um erro ao adicionar a coluna', 'error')
            console.log(error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogContent className='bg-bg text-text border-main border-2'>
                <DialogHeader>
                    <DialogTitle className='mb-3'>Crie uma coluna nova!</DialogTitle>
                    <form onSubmit={handleSubmit(handleAddColumn)} className="flex justify-center items-center gap-2">
                        <Input
                            type="text"
                            placeholder="Texto da linha..."
                            className="text-bg"
                            {...register('newColumn')}
                        />
                        <Button type="submit">Adicionar Campo</Button>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}