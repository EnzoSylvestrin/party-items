'use client';

import { FaPlus } from "react-icons/fa";

import Swal from "sweetalert2";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { createMenu } from "../serverless/createMenu";

import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

const newMenuSchema = z.object({
    newMenuName: z.string().min(1, "Nome é obrigatório"),
});

export default function NewMenus() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(newMenuSchema),
    });

    const handleAddMenu = async (data: FieldValues) => {
        try {
            await createMenu(data.newMenuName);

            window.location.reload();
        }
        catch (error: any) {
            Swal.fire('Erro', error.message, 'error');
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleAddMenu)} className="flex justify-center items-center gap-2">
            <Input
                type="text"
                placeholder="Novo Menu"
                className="text-bg"
                {...register('newMenuName')}
            />
            {errors.password && <p className="text-red-500">{String(errors.password.message)}</p>}
            <Button type="submit">
                <FaPlus />
            </Button>
        </form>
    )
}