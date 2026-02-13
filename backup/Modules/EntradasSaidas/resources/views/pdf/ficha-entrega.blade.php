<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #1f2937;
            margin: 32px;
        }
        .title {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            color: #1d4ed8;
            margin-bottom: 4px;
            text-transform: uppercase;
        }
        .subtitle {
            text-align: center;
            font-size: 12px;
            margin-bottom: 24px;
        }
        .section-title {
            font-weight: bold;
            margin-top: 24px;
            margin-bottom: 8px;
            text-transform: uppercase;
            color: #1d4ed8;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
        }
        table th, table td {
            border: 1px solid #d1d5db;
            padding: 8px;
            text-align: left;
        }
        table thead {
            background-color: #2563eb;
            color: #fff;
        }
        .declaration {
            border: 1px solid #d1d5db;
            background-color: #f3f4f6;
            padding: 12px;
            line-height: 1.5;
        }
        .employee-data {
            width: 100%;
            border-collapse: collapse;
        }
        .employee-data td {
            padding: 6px 4px;
        }
        .employee-data td.label {
            width: 20%;
            font-weight: bold;
        }
        .signature {
            margin-top: 48px;
            text-align: center;
        }
        .signature-line {
            border-top: 1px solid #111827;
            width: 220px;
            margin: 0 auto 8px auto;
        }
    </style>
</head>
<body>
    <div class="title">Ficha de Controle e Entrega de EPI</div>
    <div class="subtitle">(Equipamento de Proteção Individual)</div>

    <div class="section-title">Dados do funcionário</div>
    <table class="employee-data">
        <tr>
            <td class="label">Nome:</td>
            <td>{{ $delivery->employee?->name ?? '-' }}</td>
            <td class="label">Cargo:</td>
            <td>{{ $delivery->employee?->position?->name ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Departamento:</td>
            <td>{{ $delivery->employee?->department?->name ?? '-' }}</td>
            <td class="label">Data da entrega:</td>
            <td>{{ optional($delivery->delivered_at)->format('d/m/Y') }}</td>
        </tr>
        @if ($delivery->expected_return_at)
            <tr>
                <td class="label">Retorno previsto:</td>
                <td colspan="3">{{ optional($delivery->expected_return_at)->format('d/m/Y') }}</td>
            </tr>
        @endif
    </table>

    <div class="section-title">Declaração</div>
    <div class="declaration">
        {!! nl2br(e($declaration)) !!}
    </div>

    <div class="section-title">Equipamentos entregues</div>
    <table>
        <thead>
            <tr>
                <th style="width: 18%;">Data</th>
                <th style="width: 12%;">Quantidade</th>
                <th>Descrição do EPI</th>
                <th style="width: 20%;">Devolução prevista</th>
                <th style="width: 25%;">Observações</th>
            </tr>
        </thead>
        <tbody>
        @foreach ($delivery->items as $item)
            <tr>
                <td>{{ optional($item->delivered_at)->format('d/m/Y') ?? optional($delivery->delivered_at)->format('d/m/Y') }}</td>
                <td>{{ $item->quantity }}</td>
                <td>{{ $item->epi?->name ?? '-' }}</td>
                <td>{{ optional($item->expected_return_at ?? $delivery->expected_return_at)->format('d/m/Y') ?? '-' }}</td>
                <td>{{ $item->notes ?? '-' }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>

    <div class="signature">
        <div class="signature-line"></div>
        <div>Assinatura do colaborador</div>
        <div>Data: ____/____/______</div>
    </div>
</body>
</html>
