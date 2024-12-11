import React, { useState } from 'react';
import Dropdown from '@/Components/Dropdown';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function Chirp({ chirp }) {
    const { auth } = usePage().props;

    const [editing, setEditing] = useState(false);
    const { data, setData, patch, clearErrors, reset, errors } = useForm({
        message: chirp.message,
    });

    const { data: commentData, setData: setCommentData, post: postComment, delete: deleteComment, put: updateComment, errors: commentErrors, processing: commentProcessing, reset: resetComment } = useForm({
        content: '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('chirps.update', chirp.id), { onSuccess: () => setEditing(false) });
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        postComment(route('comments.store', chirp.id), {
            onSuccess: () => resetComment('content'),
        });
    };

    const handleCommentEdit = (e, commentId) => {
        e.preventDefault();
        updateComment(route('comments.update', commentId), {
            onSuccess: () => resetComment('content'),
        });
    };
    console.log('Chirp Data:', chirp);

    const handleCommentDelete = (commentId) => {
        deleteComment(route('comments.destroy', commentId));
    };


    const [editingComment, setEditingComment] = useState(null); // Estado para gerenciar o comentário sendo editado

const handleEditComment = (commentId) => {
    const comment = chirp.comments.find((c) => c.id === commentId);
    setEditingComment(comment); // Marca o comentário para edição
    setData('message', comment.content); // Preenche o campo com o conteúdo atual do comentário
};

const submitEdit = (e) => {
    e.preventDefault();
    // Aqui você chama a função para atualizar o comentário no back-end (Laravel)
    Inertia.put(`/comments/${editingComment.id}`, { content: data.message })
        .then(() => {
            setEditingComment(null); // Sai do modo de edição
            reset(); // Reseta o formulário
            clearErrors(); // Limpa os erros de validação
        });
};



const handleDeleteComment = (commentId) => {
    if (window.confirm('Tem certeza que deseja excluir este comentário?')) {
        Inertia.delete(`/comments/${commentId}`).then(() => {
            // Atualize os dados ou faça outra ação após a exclusão
        });
    }
};

    return (
        <div className="p-6 flex flex-col space-y-4">
            <div className="flex space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-gray-800">{chirp.user.name}</span>
                            {chirp.created_at !== chirp.updated_at && <small className="text-sm text-gray-600"> &middot; Editado</small>}
                        </div>
                        {chirp.user.id === auth.user.id && (
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <button className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 transition duration-150 ease-in-out" onClick={() => setEditing(true)}>
                                        Editar
                                    </button>
                                    <Dropdown.Link as="button" href={route('chirps.destroy', chirp.id)} method="delete">
                                        Deletar
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        )}
                    </div>
                    {editing ? (
                        <form onSubmit={submit}>
                            <textarea value={data.message} onChange={(e) => setData('message', e.target.value)} className="mt-4 w-full text-gray-900 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"></textarea>
                            <InputError message={errors.message} className="mt-2" />
                            <div className="space-x-2">
                                <PrimaryButton className="mt-4">Salvar</PrimaryButton>
                                <button className="mt-4" onClick={() => { setEditing(false); reset(); clearErrors(); }}>Cancelar</button>
                            </div>
                        </form>
                    ) : (
                        <p className="mt-4 text-lg text-gray-900">{chirp.message}</p>
                    )}
                </div>
            </div>

            {/* Comments Section */}
            <div className="mt-4">
                <h3 className="text-lg font-bold">Comentários</h3>
                <form onSubmit={handleCommentSubmit} className="mt-2">
                    <textarea
                        value={commentData.content}
                        onChange={(e) => setCommentData('content', e.target.value)}
                        placeholder="Escreva um comentário..."
                        className="w-full border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    ></textarea>
                    <InputError message={commentErrors.content} className="mt-2" />
                    <PrimaryButton className="mt-2" disabled={commentProcessing}>Comentar</PrimaryButton>
                </form>

                <div className="mt-4">
            
                {chirp.comments && chirp.comments.length > 0 ? (
    chirp.comments.map((comment) => (
        <div key={comment.id} className="mt-4 border-t pt-2">
            <div className="flex justify-between">
                <div>
                    <p className="text-gray-800">
                        <strong>{comment.user.name}</strong>: {comment.content}
                    </p>
                </div>

                {/* Verifica se o usuário autenticado é o autor do comentário */}
                {comment.user.id === auth.user.id && (
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                            <button className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 transition duration-150 ease-in-out" onClick={() => handleEditComment(comment.id)}>
                                Editar
                            </button>
                            <Dropdown.Link as="button" href={route('comments.destroy', comment.id)} method="delete">
                                Deletar
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                )}
            </div>

            {/* Exibe o formulário de edição se o estado `editing` estiver ativo */}
            {editingComment && editingComment.id === comment.id ? (
                <form onSubmit={submitEdit}>
                    <textarea
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        className="mt-4 w-full text-gray-900 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                    />
                    <InputError message={errors.message} className="mt-2" />
                    <div className="space-x-2">
                        <PrimaryButton className="mt-4">Salvar</PrimaryButton>
                        <button
                            className="mt-4"
                            onClick={() => { setEditingComment(null); reset(); clearErrors(); }}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            ) : (
                <p className="mt-4 text-lg text-gray-900">{}</p>
            )}
        </div>
    ))
) : (
    <p className="text-gray-500 mt-2">Nenhum comentário ainda.</p>
)}
</div>


            </div>
        </div>
    );
}