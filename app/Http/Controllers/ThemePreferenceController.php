<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ThemePreferenceController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'theme' => ['required', 'string', 'in:light,dark,system'],
        ]);

        $user = $request->user();
        if ($user) {
            $user->theme_preference = $data['theme'];
            $user->save();
        }

        return back();
    }
}
