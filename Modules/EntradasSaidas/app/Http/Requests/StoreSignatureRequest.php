<?php

namespace Modules\EntradasSaidas\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSignatureRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'signature' => ['required', 'string', 'starts_with:data:image/png;base64'],
            'signed_by_name' => ['nullable', 'string', 'max:255'],
        ];
    }
}
