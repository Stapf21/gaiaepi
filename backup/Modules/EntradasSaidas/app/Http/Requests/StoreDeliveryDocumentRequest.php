<?php

namespace Modules\EntradasSaidas\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDeliveryDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'document' => ['required', 'file', 'mimetypes:application/pdf', 'max:10240'],
        ];
    }
}
