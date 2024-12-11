import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ProfilePhotoModal({ open, setOpen, setProfilePhoto }) {
    const [photo, setPhoto] = useState(null);
    const [errors, setErrors] = useState({});

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!photo) {
            setErrors({ profile_photo: 'Profile photo is required' });
            return;
        }

        setProfilePhoto(photo); // Armazena a foto no estado do componente principal
        setOpen(false); // Fecha o modal
    };

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                            Upload Profile Photo
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                                                <div>
                                                    <InputLabel htmlFor="profile_photo" value="Profile Photo" />
                                                    <input
                                                        id="profile_photo"
                                                        name="profile_photo"
                                                        type="file"
                                                        onChange={handlePhotoChange}
                                                        className="mt-1 block w-full"
                                                    />
                                                </div>
                                                <PrimaryButton type="submit" className="w-full">
                                                    Save
                                                </PrimaryButton>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
