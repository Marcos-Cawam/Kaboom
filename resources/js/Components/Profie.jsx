import React, { useState } from 'react';
import axios from 'axios';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function ProfilePhotoUpload() {
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});

    const handlePhotoChange = (e) => {
        setProfilePhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('profile_photo', profilePhoto);
        formData.append('name', name);
        formData.append('email', email);

        try {
            const response = await axios.post('/profile/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            // Lide com a resposta, como mostrar uma mensagem de sucesso
        } catch (error) {
            if (error.response) {
                setErrors(error.response.data.errors);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="mt-6 space-y-6">
            <div>
                <InputLabel htmlFor="name" value="Name" />
                <TextInput
                    id="name"
                    name="name"
                    className="mt-1 block w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="email" value="Email" />
                <TextInput
                    id="email"
                    name="email"
                    type="email"
                    className="mt-1 block w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                />
                <InputError message={errors.email} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="profile_photo" value="Profile Photo" />
                <input
                    id="profile_photo"
                    name="profile_photo"
                    type="file"
                    onChange={handlePhotoChange}
                    className="mt-1 block w-full"
                />
                <InputError message={errors.profile_photo} className="mt-2" />
            </div>

            <PrimaryButton type="submit" className="mt-4">
                Save
            </PrimaryButton>
        </form>
    );
}
