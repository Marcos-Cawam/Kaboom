import React, { useState, useEffect } from 'react';
import ProfilePhotoModal from '@/Components/ProfilePhotoModal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const [open, setOpen] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState(false);

    const { data, setData, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('name', data.name);
        formData.append('email', data.email);
        if (profilePhoto) {
            formData.append('profile_photo', profilePhoto);
        }

        try {
            const url = route('profile.update');
            console.log('URL gerada:', url); // Verifique a URL no console do navegador
            await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Profile updated successfully');
            setSuccessMessage(true);
            setTimeout(() => setSuccessMessage(false), 3000); // Mostrar mensagem de sucesso por 3 segundos
        } catch (error) {
            if (error.response) {
                setErrors(error.response.data.errors);
            }
            console.error('Error updating profile:', error.response ? error.response.data : error);
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-900">
                    Informações do Perfil
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-900">
                    Atualize as informações de perfil e endereço de e-mail da sua conta.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Nome" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors && errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="E-mail" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors && errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                            Seu endereço de e-mail não foi verificado.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                            >
                                Clique aqui para reenviar o e-mail de verificação.

                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                Um novo link de verificação foi enviado para seu endereço de e-mail.
                                
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Salvar</PrimaryButton>
                    <Transition
                        show={successMessage}
                        enter="transition ease-in-out duration-500 transform"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in-out duration-500 transform"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-900">Salvo.</p>
                    </Transition>
                </div>
            </form>

            <div className="mt-6 space-y-6">
                <PrimaryButton onClick={() => setOpen(true)}>
                    Carregue sua nova foto de perfil
                </PrimaryButton>
            </div>

            <ProfilePhotoModal open={open} setOpen={setOpen} setProfilePhoto={setProfilePhoto} />

            {/* Barra de carregamento */}
            <Transition
                show={processing}
                enter="transition ease-in-out duration-500 transform"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in-out duration-500 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
                className="fixed top-0 left-0 w-full h-1 bg-blue-500 z-50"
            />
        </section>
    );
}
