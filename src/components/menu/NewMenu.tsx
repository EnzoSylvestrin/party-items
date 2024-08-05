'use client';

import { useState } from "react";

import { FaPlus } from "react-icons/fa";

import Swal from "sweetalert2";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { createMenu } from "../serverless/createMenu";

import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { Loader2 } from "lucide-react";

const newMenuSchema = z.object({
    newMenuName: z.string().min(1, "Nome é obrigatório"),
});

export default function NewMenus({ refresh }: { refresh: () => Promise<void> }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: zodResolver(newMenuSchema),
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleAddMenu = async (data: FieldValues) => {
        setIsLoading(true);

        try {
            await createMenu(data.newMenuName);

            setValue('newMenuName', '');

            refresh();
        }
        catch (error: any) {
            Swal.fire('Erro', error.message, 'error');
            console.error(error);
        }
        finally {
            setIsLoading(false);
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
            <Button type="submit" disabled={isLoading}>
                {
                    isLoading ? 
                    <Loader2 className="h-4 w-4 animate-spin" />
                    : 
                    <FaPlus />
                }
            </Button>
        </form>
    )
}