'use client';

import { useState } from 'react';

import { useForm, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { BiUser } from 'react-icons/bi';

import { useAuth } from '../../context/AuthContext';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

import Swal from 'sweetalert2';

import { z } from 'zod';
import { Login } from '../serverless/login';
import { SignUp } from '../serverless/signUp';

const loginSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  password: z.string().min(3, "A senha deve ter no mínimo 3 caracteres"),
});

const createUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Formato de cor inválido"),
  password: z.string().min(3, "A senha deve ter no mínimo 3 caracteres"),
});

const UserModal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [open, setOpen] = useState(false);

  const auth = useAuth();
  const login = auth?.login;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : createUserSchema),
  });

  const onSubmit = async (data: FieldValues) => {
    if (isLogin) {
      try {
        const result = await Login({ name: data.name, password: data.password });

        if (!result.success) {
          setError('name', { message: 'Usuário ou senha inválidos' });
          return;
        }

        console.log(result)

        if (login) {
          login(result.user);
        }

        setOpen(false);

        Swal.fire('Sucesso', 'Login realizado com sucesso!', 'success');

      }
      catch (e) {
        Swal.fire('Erro', 'Ocorreu um erro ao fazer o login!', 'error');
        console.log(e);
      }
    }
    else {
      try {
        const result = await SignUp({ name: data.name, password: data.password, color: data.color });

        if (!result.success) {
          setError('name', { message: 'Usuário já existe' });
          return;
        }

        if (login) {
          login(result.user);
        }

        setOpen(false);
  
        Swal.fire('Sucesso', 'Usuário criado com sucesso!', 'success');

      }
      catch (e) {
        Swal.fire('Erro', 'Ocorreu um erro ao criar o usuário!', 'error');
        console.log(e);
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <div className='flex items-center justify-center h-12'>
          <Button className='p-3 rounded-full'>
            <BiUser size={16} />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className='bg-bg text-text border-main border-2'>
        <DialogHeader>
          <DialogTitle className='mb-3'>{isLogin ? 'Entrar' : 'Criar Usuário'}</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <Input
              placeholder='Nome'
              {...register('name')}
              className='p-2 border rounded'
            />
            {errors.name && <p className="text-red-500">{String(errors.name.message)}</p>}
            <Input
              type='password'
              placeholder='Senha'
              {...register('password')}
              className='p-2 border rounded'
              />
            {errors.password && <p className="text-red-500">{String(errors.password.message)}</p>}
            {!isLogin && (
              <div className='flex items-center gap-3'>
                <label htmlFor='color' className='text-text'>Cor do Nome:</label>
                <input
                  type='color'
                  placeholder='Cor do Nome (Hexadecimal)'
                  {...register('color')}
                  className='p-[2px] border rounded w-12'
                />
              </div>
            )}
            {!isLogin && errors.color && <p className="text-red-500">{String(errors.color.message)}</p>}
            <a href="#" onClick={() => setIsLogin(!isLogin)} className="text-blue-500 text-center">
              {isLogin ? 'Não tem conta ainda? Crie agora' : 'Já tem conta? Entre agora'}
            </a>
            <Button type="submit">{isLogin ? 'Login' : 'Criar Usuário'}</Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
