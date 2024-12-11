<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Comment;

class CommentPolicy
{
    /**
     * Determine whether the user can update the comment.
     */
    public function update(User $user, Comment $comment)
    {
        return $user->id === $comment->user_id; // Verifica se o usuário é o dono do comentário
    }

    /**
     * Determine whether the user can delete the comment.
     */
    public function delete(User $user, Comment $comment)
    {
        return $user->id === $comment->user_id; // Verifica se o usuário é o dono do comentário
    }
}
