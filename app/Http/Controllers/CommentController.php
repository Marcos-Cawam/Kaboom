<?php

namespace App\Http\Controllers;

use App\Models\Chirp;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;


class CommentController extends Controller
{

    use AuthorizesRequests; // Utilize o trait aqui


    public function store(Request $request, Chirp $chirp)
    {
        $request->validate([
            'content' => 'required|string|max:500',
        ]);

        $chirp->comments()->create([
            'content' => $request->content,
            'user_id' => auth()->id(),
        ]);

        return redirect()->back()->with('message', 'Comentário adicionado!');
    }

    public function edit(Comment $comment)
    {
        $this->authorize('update', $comment);

        return view('comments.edit', compact('comment'));
    }

    public function update(Request $request, Comment $comment)
    {
        $this->authorize('update', $comment);

        $request->validate([
            'content' => 'required|string|max:500',
        ]);

        $comment->update(['content' => $request->content]);

        return redirect()->back()->with('message', 'Comentário atualizado!');
    }

    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);

        $comment->delete();

        return redirect()->back()->with('message', 'Comentário removido!');
    }

    
}
