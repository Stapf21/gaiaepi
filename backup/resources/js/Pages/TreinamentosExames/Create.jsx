import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import InputError from '@/Components/InputError.jsx';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { inputBaseClass, textareaBaseClass } from '@/lib/formStyles';

export default function TreinamentosExamesCreate({ examTypes = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'training',
        title: '',
        code: '',
        description: '',
        validity_months: '',
        workload_hours: '',
        mandatory: true,
        exam_type: examTypes[0]?.value ?? '',
    });

    const handleTypeChange = (value) => {
        setData((prev) => ({
            ...prev,
            type: value,
            ...(value === 'exam'
                ? { workload_hours: '', mandatory: false }
                : { exam_type: examTypes[0]?.value ?? '' }),
        }));
    };

    const submit = (event) => {
        event.preventDefault();
        post(route('treinamentosexames.store'));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-lg font-semibold tracking-tight">Novo treinamento ou exame</h2>}>
            <Head title="Cadastrar treinamento/exame" />

            <div className="mx-auto max-w-4xl space-y-6 px-4 pb-10 pt-6 lg:px-8">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-col gap-1">
                        <CardTitle className="text-base font-semibold text-slate-800">
                            Informações gerais
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Cadastre treinamentos obrigatórios ou exames ocupacionais acompanhados pela equipe de SST.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <Tabs value={data.type} onValueChange={handleTypeChange}>
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="training">Treinamento</TabsTrigger>
                                    <TabsTrigger value="exam">Exame</TabsTrigger>
                                </TabsList>

                                <div className="mt-6 grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2 md:col-span-2">
                                        <label htmlFor="title" className="text-sm font-medium text-slate-700">
                                            Título
                                        </label>
                                        <input
                                            id="title"
                                            type="text"
                                            className={inputBaseClass}
                                            value={data.title}
                                            onChange={(event) => setData('title', event.target.value)}
                                            required
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="code" className="text-sm font-medium text-slate-700">
                                            Código interno
                                        </label>
                                        <input
                                            id="code"
                                            type="text"
                                            className={inputBaseClass}
                                            value={data.code}
                                            onChange={(event) => setData('code', event.target.value)}
                                        />
                                        <InputError message={errors.code} />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="validity_months" className="text-sm font-medium text-slate-700">
                                            Validade (meses)
                                        </label>
                                        <input
                                            id="validity_months"
                                            type="number"
                                            min="0"
                                            className={inputBaseClass}
                                            value={data.validity_months}
                                            onChange={(event) => setData('validity_months', event.target.value)}
                                        />
                                        <InputError message={errors.validity_months} />
                                    </div>
                                </div>

                                <TabsContent value="training" className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label htmlFor="workload_hours" className="text-sm font-medium text-slate-700">
                                                Carga horária (h)
                                            </label>
                                            <input
                                                id="workload_hours"
                                                type="number"
                                                min="0"
                                                className={inputBaseClass}
                                                value={data.workload_hours}
                                                onChange={(event) => setData('workload_hours', event.target.value)}
                                            />
                                            <InputError message={errors.workload_hours} />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">
                                                Treinamento obrigatório?
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    id="mandatory"
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                    checked={data.mandatory}
                                                    onChange={(event) => setData('mandatory', event.target.checked)}
                                                />
                                                <label htmlFor="mandatory" className="text-sm text-slate-700">
                                                    Obrigatório para função/cargo
                                                </label>
                                            </div>
                                            <InputError message={errors.mandatory} />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="exam" className="space-y-6">
                                    <div className="space-y-2 md:w-1/2">
                                        <label htmlFor="exam_type" className="text-sm font-medium text-slate-700">
                                            Tipo de exame
                                        </label>
                                        <select
                                            id="exam_type"
                                            className={inputBaseClass}
                                            value={data.exam_type ?? ''}
                                            onChange={(event) => setData('exam_type', event.target.value)}
                                        >
                                            {examTypes.map((item) => (
                                                <option key={item.value} value={item.value}>
                                                    {item.label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.exam_type} />
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className="space-y-2">
                                <label htmlFor="description" className="text-sm font-medium text-slate-700">
                                    Descrição / objetivos
                                </label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    className={textareaBaseClass}
                                    value={data.description}
                                    onChange={(event) => setData('description', event.target.value)}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        reset();
                                        setData('type', 'training');
                                        setData('mandatory', true);
                                        setData('exam_type', examTypes[0]?.value ?? '');
                                    }}
                                >
                                    Limpar
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={route('treinamentosexames.index')}>Cancelar</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Salvando...' : 'Salvar cadastro'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
