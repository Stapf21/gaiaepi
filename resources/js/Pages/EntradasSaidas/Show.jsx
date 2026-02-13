import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import InputError from '@/Components/InputError.jsx';
import Modal from '@/Components/Modal.jsx';
import SignaturePad from 'signature_pad';
import { FileText, Upload, Trash2, ArrowLeft, Pencil } from 'lucide-react';

const statusColor = {
    entregue: 'bg-indigo-100 text-indigo-700',
    em_uso: 'bg-amber-100 text-amber-700',
    devolvido: 'bg-emerald-100 text-emerald-700',
    perdido: 'bg-rose-100 text-rose-700',
};

const formatStatus = (status) => status.replace('_', ' ');

export default function EntradasSaidasShow({ delivery, documents = [], document }) {
    const uploadInputRef = useRef(null);
    const updateInputsRef = useRef({});
    const [updatingDocumentId, setUpdatingDocumentId] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        document: null,
    });
    const deleteMovementForm = useForm({});
    const [isSignatureModalOpen, setSignatureModalOpen] = useState(false);
    const signatureCanvasRef = useRef(null);
    const signaturePadRef = useRef(null);
    const signatureForm = useForm({
        signature: '',
        signed_by_name: delivery?.employee?.name ?? '',
    });

    const documentRows = useMemo(
        () =>
            documents.map((doc) => ({
                ...doc,
                isSigned: doc.type === 'signed',
            })),
        [documents],
    );

    const signatureInfo = delivery?.signature ?? {};
    const hasSignature = Boolean(signatureInfo.url);
    const canCollectSignature = Boolean(signatureInfo.store_url);

    const handleUploadChange = (event) => {
        const [file] = event.target.files ?? [];
        if (!file) {
            return;
        }
        setData('document', file);
    };

    const submitDocument = (event) => {
        event.preventDefault();
        if (!data.document) {
            return;
        }
        post(route('entradassaidas.documents.store', delivery.id), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                if (uploadInputRef.current) {
                    uploadInputRef.current.value = '';
                }
            },
        });
    };

    const triggerUpdate = (id) => {
        if (!updateInputsRef.current[id]) {
            return;
        }
        updateInputsRef.current[id].click();
    };

    const handleUpdateChange = (id, event) => {
        const [file] = event.target.files ?? [];
        if (!file) {
            return;
        }

        setUpdatingDocumentId(id);

        const formData = new FormData();
        formData.append('document', file);
        formData.append('_method', 'put');

        router.post(route('entradassaidas.documents.update', [delivery.id, id]), formData, {
            forceFormData: true,
            onFinish: () => {
                setUpdatingDocumentId(null);
                if (updateInputsRef.current[id]) {
                    updateInputsRef.current[id].value = '';
                }
            },
        });
    };

    const handleDelete = (id) => {
        if (!window.confirm('Excluir o documento selecionado?')) {
            return;
        }

        router.delete(route('entradassaidas.documents.destroy', [delivery.id, id]), {
            preserveScroll: true,
        });
    };

    const handleDestroyMovement = () => {
        if (!delivery?.destroy_url) {
            return;
        }

        if (!window.confirm('Deseja realmente excluir esta movimentacao? Essa acao nao pode ser desfeita.')) {
            return;
        }

        deleteMovementForm.delete(delivery.destroy_url, {
            preserveScroll: true,
        });
    };

    const openSignatureModal = () => {
        setSignatureModalOpen(true);
        signatureForm.clearErrors();
        signatureForm.setData('signed_by_name', delivery?.employee?.name ?? '');
    };

    const closeSignatureModal = () => {
        setSignatureModalOpen(false);
        signatureForm.reset({
            signature: '',
            signed_by_name: delivery?.employee?.name ?? '',
        });
        signaturePadRef.current?.clear?.();
    };

    const clearSignature = () => {
        signaturePadRef.current?.clear?.();
        signatureForm.clearErrors('signature');
    };

    const submitSignature = (event) => {
        event.preventDefault();

        if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) {
            signatureForm.setError('signature', 'Desenhe a assinatura para continuar.');
            return;
        }

        if (!signatureInfo.store_url) {
            return;
        }

        const dataUrl = signaturePadRef.current.toDataURL('image/png');
        signatureForm.clearErrors('signature');
        signatureForm.transform((data) => ({
            ...data,
            signature: dataUrl,
        }));

        signatureForm.post(signatureInfo.store_url, {
            preserveScroll: true,
            onSuccess: () => {
                closeSignatureModal();
            },
            onFinish: () => {
                signatureForm.transform((data) => data);
                signatureForm.setData('signature', '');
            },
        });
    };

    useEffect(() => {
        if (!isSignatureModalOpen) {
            signaturePadRef.current = null;
            return;
        }

        let pad = null;
        let cleanupResize;

        const init = () => {
            const canvas = signatureCanvasRef.current;
            if (!canvas) {
                requestAnimationFrame(init);
                return;
            }

            const resizeCanvas = () => {
                const rect = canvas.getBoundingClientRect();
                const width = rect.width || 400;
                const height = rect.height || 220;
                const ratio = Math.max(window.devicePixelRatio || 1, 1);

                canvas.width = width * ratio;
                canvas.height = height * ratio;
                canvas.style.width = `${width}px`;
                canvas.style.height = `${height}px`;

                const ctx = canvas.getContext('2d');
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.scale(ratio, ratio);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, width, height);
            };

            resizeCanvas();

            pad = new SignaturePad(canvas, {
                backgroundColor: '#ffffff',
                penColor: '#0f172a',
                minWidth: 0.6,
                maxWidth: 2.5,
            });
            signaturePadRef.current = pad;

            const handleResize = () => {
                const data = pad.toData();
                resizeCanvas();
                pad.fromData(data);
            };

            window.addEventListener('resize', handleResize);
            cleanupResize = () => window.removeEventListener('resize', handleResize);
        };

        init();

        return () => {
            cleanupResize?.();
            pad?.off?.();
            pad = null;
            signaturePadRef.current = null;
        };
    }, [isSignatureModalOpen]);

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Detalhes da movimentacao</h2>}>
            <Head title={`Movimentacao ${delivery.code}`} />

            <div className="mx-auto max-w-5xl space-y-6 px-4 pb-12 pt-6 lg:px-8">
                <div>
                    <Button asChild variant="ghost" size="sm" className="-ml-2">
                        <Link href={route('entradassaidas.index')} className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Voltar
                        </Link>
                    </Button>
                </div>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle className="text-base font-semibold text-slate-900">
                                {delivery.code}
                            </CardTitle>
                            <p className="text-sm text-slate-600">
                                {delivery.employee?.name ?? 'Colaborador nao informado'}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge className={statusColor[delivery.status] ?? 'bg-slate-200 text-slate-700'}>
                                {formatStatus(delivery.status)}
                            </Badge>
                            <div className="flex items-center gap-2">
                                {delivery.edit_url ? (
                                    <Button asChild variant="outline" size="sm" className="flex items-center gap-2">
                                        <Link href={delivery.edit_url}>
                                            <Pencil className="h-4 w-4" />
                                            Editar
                                        </Link>
                                    </Button>
                                ) : null}
                                {delivery.destroy_url ? (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="flex items-center gap-2"
                                        onClick={handleDestroyMovement}
                                        disabled={deleteMovementForm.processing}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Excluir
                                    </Button>
                                ) : null}
                            </div>
                            {document?.url ? (
                                <Button asChild variant="default" size="sm">
                                    <a href={document.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Ver documento
                                    </a>
                                </Button>
                            ) : null}
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-medium uppercase text-slate-500">Colaborador</p>
                            <p className="text-sm text-slate-800">{delivery.employee?.name ?? '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase text-slate-500">Cargo</p>
                            <p className="text-sm text-slate-800">{delivery.employee?.position ?? '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase text-slate-500">Departamento</p>
                            <p className="text-sm text-slate-800">{delivery.employee?.department ?? '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase text-slate-500">Data da entrega</p>
                            <p className="text-sm text-slate-800">{delivery.delivered_at ?? '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase text-slate-500">Retorno previsto</p>
                            <p className="text-sm text-slate-800">{delivery.expected_return_at ?? '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase text-slate-500">Observacoes</p>
                            <p className="text-sm text-slate-800">{delivery.notes ?? '-'}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-slate-900">
                            Equipamentos entregues
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>EPI</TableHead>
                                    <TableHead>Quantidade</TableHead>
                                    <TableHead>Entrega</TableHead>
                                    <TableHead>Retorno previsto</TableHead>
                                    <TableHead>Observacoes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {delivery.items?.length ? (
                                    delivery.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.epi ?? '-'}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>{item.delivered_at ?? delivery.delivered_at ?? '-'}</TableCell>
                                            <TableCell>{item.expected_return_at ?? '-'}</TableCell>
                                            <TableCell>{item.notes ?? '-'}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                                            Nenhum item vinculado.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-base font-semibold text-slate-900">
                                Assinatura eletrônica
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Registre a assinatura do colaborador diretamente pelo sistema.
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {hasSignature ? (
                            <div className="space-y-2">
                                <div className="rounded-md border border-slate-200 bg-white p-3">
                                    <img
                                        src={signatureInfo.url}
                                        alt="Assinatura do colaborador"
                                        className="h-24 w-full object-contain"
                                    />
                                </div>
                                <p className="text-sm text-slate-600">
                                    Assinado por{' '}
                                    <span className="font-semibold">{signatureInfo.signed_by ?? 'Colaborador'}</span>
                                    {signatureInfo.signed_at ? ` em ${signatureInfo.signed_at}` : ''}.
                                </p>
                                {signatureInfo.collected_by && (
                                    <p className="text-xs text-slate-500">
                                        Registrado por {signatureInfo.collected_by}.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Nenhuma assinatura registrada para esta movimentação.
                            </p>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        {canCollectSignature && (
                            <Button
                                type="button"
                                onClick={openSignatureModal}
                                disabled={signatureForm.processing}
                            >
                                {hasSignature ? 'Atualizar assinatura' : 'Coletar assinatura'}
                            </Button>
                        )}
                    </CardFooter>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-slate-900">
                            Documentos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form
                            onSubmit={submitDocument}
                            encType="multipart/form-data"
                            className="flex flex-col gap-3 rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <p className="text-sm font-medium text-slate-800">
                                    Enviar documento assinado (PDF)
                                </p>
                                <p className="text-xs text-slate-500">
                                    O arquivo sera adicionado como uma nova versao assinada.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    ref={uploadInputRef}
                                    id="signed-document"
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={handleUploadChange}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => uploadInputRef.current?.click()}
                                >
                                    Selecionar arquivo
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing || !data.document}
                                    className="flex items-center gap-2"
                                >
                                    <Upload className="h-4 w-4" />
                                    Enviar
                                </Button>
                            </div>
                        </form>
                        <InputError message={errors.document} />

                        <div className="space-y-3">
                            {documentRows.length ? (
                                documentRows.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">
                                                {doc.label} • Versao {doc.version.toString().padStart(2, '0')}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {doc.created_at ?? '-'}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Button variant="ghost" size="sm" asChild>
                                                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                                    Ver
                                                </a>
                                            </Button>

                                            {doc.isSigned ? (
                                                <>
                                                    <input
                                                        ref={(element) => {
                                                            updateInputsRef.current[doc.id] = element;
                                                        }}
                                                        type="file"
                                                        accept="application/pdf"
                                                        className="hidden"
                                                        onChange={(event) => handleUpdateChange(doc.id, event)}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => triggerUpdate(doc.id)}
                                                        disabled={updatingDocumentId === doc.id}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Upload className="h-4 w-4" />
                                                        {updatingDocumentId === doc.id ? 'Atualizando...' : 'Atualizar'}
                                                    </Button>
                                                    {doc.can_delete ? (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(doc.id)}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Excluir
                                                        </Button>
                                                    ) : null}
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Nenhum documento disponivel.
                                </p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="text-xs text-slate-500">
                        A declaracao utilizada pode ser personalizada em Configuracoes → Preferencias do sistema.
                    </CardFooter>
                </Card>
            </div>

            <Modal show={isSignatureModalOpen} onClose={closeSignatureModal}>
                <form onSubmit={submitSignature}>
                    <div className="space-y-4 p-6">
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Registrar assinatura</h3>
                            <p className="text-sm text-slate-500">
                                Utilize a mesa digitalizadora ou o mouse para coletar a assinatura do colaborador.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="signed_by_name" className="text-sm font-medium text-slate-700">
                                Nome do colaborador
                            </label>
                            <input
                                id="signed_by_name"
                                type="text"
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                                value={signatureForm.data.signed_by_name}
                                onChange={(event) => signatureForm.setData('signed_by_name', event.target.value)}
                                placeholder="Nome para exibir no relatório"
                            />
                            <InputError message={signatureForm.errors.signed_by_name} />
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-medium text-slate-700">Assine no quadro abaixo</p>
                            <div className="rounded-md border border-slate-300 bg-white">
                                <canvas
                                    ref={signatureCanvasRef}
                                    className="h-48 w-full"
                                    style={{ touchAction: 'none', backgroundColor: '#ffffff' }}
                                ></canvas>
                            </div>
                            <InputError message={signatureForm.errors.signature} />
                            <div className="flex justify-end">
                                <Button type="button" variant="ghost" size="sm" onClick={clearSignature}>
                                    Limpar
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
                        <Button type="button" variant="outline" onClick={closeSignatureModal}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={signatureForm.processing}>
                            {signatureForm.processing ? 'Salvando...' : 'Salvar assinatura'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
