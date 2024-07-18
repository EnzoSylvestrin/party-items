'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { BiUser } from 'react-icons/bi';
import Swal from 'sweetalert2';

import { FieldValues } from 'react-hook-form';

const loginSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório!"),
  password: z.string().min(3, "A senha precisa ter pelo menos 3 caracteres"),
});

const createUserSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório!"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "A cor está num formato inválido"),
  password: z.string().min(3, "A senha precisa ter pelo menos 3 caracteres"),
  isAdmin: z.boolean().optional(),
});

const UserModal = () => {
  const [isLogin, setIsLogin] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : createUserSchema),
  });

  
  const onSubmit = async (data: FieldValues) => {
    const url = isLogin ? '/api/users/login' : '/api/users';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.success) {
        Swal.fire('Sucesso', isLogin ? 'Login realizado com sucesso!' : 'Usuário criado com sucesso!', 'success');
          // handle successful response
    } else {
        Swal.fire('Erro', isLogin ? 'Ocorreu um erro ao fazer o login!' : 'Ocorreu um erro ao criar o usuário!', 'error');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='flex items-center justify-center h-12'>
          <Button className='bg-main hover:bg-main/80 transition-all duration-200 p-3 rounded-full'>
            <BiUser size={16} />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className='bg-bg text-text'>
        <DialogHeader>
          <DialogTitle>{isLogin ? 'Entrar' : 'Criar Usuário'}</DialogTitle>
          <DialogDescription>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
              <input
                type='text'
                placeholder='Nome'
                {...register('name')}
                className='p-2 border rounded'
              />
              {errors.name && <p className="text-red-500">{String(errors.name.message)}</p>}
              {!isLogin && (
                <input
                  type='text'
                  placeholder='Cor do Nome (Hexadecimal)'
                  {...register('color')}
                  className='p-2 border rounded'
                />
              )}
              {!isLogin && errors.color && <p className="text-red-500">{String(errors.color.message)}</p>}
              <input
                type='password'
                placeholder='Senha'
                {...register('password')}
                className='p-2 border rounded'
              />
              {errors.password && <p className="text-red-500">{String(errors.password.message)}</p>}
              {!isLogin && (
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    {...register('isAdmin')}
                  />
                  Administrador
                </label>
              )}
              <a href="#" onClick={() => setIsLogin(!isLogin)} className="text-blue-500">
                {isLogin ? 'Não tem conta ainda? Crie agora' : 'Já tem conta? Entre agora'}
              </a>
              <Button type="submit">{isLogin ? 'Login' : 'Criar Usuário'}</Button>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
