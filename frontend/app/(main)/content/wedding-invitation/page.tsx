'use client';
import { emptyWeddingContent } from '@/app/emptyModel/emptyModels';
import { Demo } from '@/types';
import { defaultFilters } from '@/util/defaultFilter';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Fieldset } from 'primereact/fieldset';
import { FileUpload } from 'primereact/fileupload';
import { InputMask } from 'primereact/inputmask';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { createWedding, deleteWedding, getAllWeddingContent, getWeddingByCategory, launchWedding, updateWedding } from '../../../../service/wedding.service';
import { set } from 'lodash';
import { ProgressBar } from 'primereact/progressbar';
import axios, { AxiosProgressEvent } from 'axios';
import { Colors } from 'chart.js';

const WeddingContentPage = () => {
    const [weddingContents, setWeddingContents] = useState(null);
    const [weddingContentDialog, setWeddingContentDialog] = useState(false);
    const [deleteWeddingContentDialog, setDeleteWeddingContentDialog] = useState(false);
    const [deleteWeddingContentsDialog, setDeleteWeddingContentsDialog] = useState(false);
    const [weddingContent, setWeddingContent] = useState<Demo.wedding>(emptyWeddingContent);
    const [selectedWeddingContents, setSelectedWeddingContents] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
    const [dropdownValue, setDropdownValue] = useState<InputValue | null>(null);
    const [isViewMode, setIsViewMode] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isInvalid, setIsInvalid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [disableLoveStory, setDisableLoveStory] = useState(true);
    const [importDialog, setImportDialog] = useState(false);
    const [imageDialog, setImageDialog] = useState(false);
    const [imageName, setImageName] = useState('');

    interface InputValue {
        name: string;
        code: string;
    }

    const dropdownValues: InputValue[] = [
        { name: 'Glamour', code: 'glamour' },
        { name: 'Rustic', code: 'rustic' },
        { name: 'Classic', code: 'classic' },
        { name: 'Outdoor', code: 'outdoor' },
        { name: 'Luxury', code: 'luxury' }
    ];

    const hideDialog = () => {
        setSubmitted(false);
        setWeddingContentDialog(false);
    };

    useEffect(() => {
        const fetchDataWedding = async () => {
            setIsLoading(true);
            try {
                let userData;
                if (dropdownValue && dropdownValue.code) {
                    // Fetch based on selected category
                    userData = await getWeddingByCategory(dropdownValue.code);
                } else {
                    // Fetch all wedding content
                    userData = await getAllWeddingContent();
                }
                setWeddingContents(userData); // Assume response has a `data` property
            } catch (err: any) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'error',
                    detail: 'Failed to fetch menu data',
                    life: 3000
                });
                setWeddingContents(null);
            } finally {
                setTimeout(() => setIsLoading(false), 500);
            }
        };

        fetchDataWedding();
    }, [dropdownValue]);

    //#region function

    const openNew = () => {
        setWeddingContent(emptyWeddingContent);
        setSubmitted(false);
        setIsViewMode(false);
        setWeddingContentDialog(true);
    };

    const hideDeleteWeddingContentDialog = () => {
        setDeleteWeddingContentDialog(false);
    };

    const hideDeleteWeddingContentsDialog = () => {
        setDeleteWeddingContentsDialog(false);
    };

    const deleteWeddingContent = async () => {
        try {
            const date = new Date();
            const formatedDate = date.toLocaleDateString('en-GB');

            // Download weddingContent data as JSON before deleting
            const jsonData = JSON.stringify(weddingContent, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Wedding-[${weddingContent.path}][${formatedDate}].json`; // Name the file dynamically
            link.click();
            URL.revokeObjectURL(url);

            // Proceed with the delete operation
            await deleteWedding(weddingContent._id);
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Success to delete',
                life: 3000
            });

            const updatedWeddingContents = await getAllWeddingContent();
            setWeddingContents(updatedWeddingContents);
        } catch (err: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete',
                life: 3000
            });
            setWeddingContents(null);
        } finally {
            setDeleteWeddingContentDialog(false);
            setWeddingContent(emptyWeddingContent);
        }
    };

    const UploadImageHandler = (imageName: string) => {
        if (!weddingContent.path || !weddingContent.category) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please fill in all required fields.',
                life: 3000
            });
            return;
        }
        setImageName(imageName);
        setImageDialog(true);
    };

    const renameFile = (file: File, newFileName: string) => {
        const blob = file.slice(0, file.size, file.type); // Membuat blob dari file asli
        return new File([blob], newFileName, { type: file.type }); // Membuat file baru dengan nama baru
    };

    const onUploadHandler = async (file: File) => {
        if (!file) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Error',
                life: 3000
            });
            return; // Stop execution if validation fails
        }

        const uniqueSuffix = Math.round(Math.random() * 1e9);
        const newFileName = `${imageName}-${uniqueSuffix}${file.type ? `.${file.type.split('/')[1]}` : ''}`;
        const renamedFile = renameFile(file, newFileName);

        const fd = new FormData();
        fd.append('file', renamedFile); // Kirim file dengan nama yang sudah diubah

        axios
            .post(`http://localhost:4004/images/${weddingContent.category}/${weddingContent.path}`, fd)
            .then((res) => {
                // Tampilkan notifikasi sukses
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: res.data.message,
                    life: 3000
                });

                setWeddingContent((prev) => ({
                    ...prev,
                    imageUrl: {
                        ...prev.imageUrl,
                        [imageName]: newFileName
                    }
                }));

                // Reset nama file
                setImageName('');
            })
            .catch((er) => {
                console.log(er);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Failed Upload',
                    detail: 'File failed uploaded.' + er,
                    life: 3000
                });
            })
            .finally(() => {
                setImageDialog(false);
            });
    };

    const editWeddingContent = (weddingcontent: Demo.wedding) => {
        setWeddingContent({ ...weddingcontent });
        setIsViewMode(false);
        setWeddingContentDialog(true);
    };

    const viewWeddingContent = (weddingcontent: Demo.wedding) => {
        setWeddingContent({ ...weddingcontent });
        setIsViewMode(true);
        setWeddingContentDialog(true);
    };

    const confirmDeleteWeddingContent = (weddingcontent: Demo.wedding) => {
        setWeddingContent(weddingcontent);
        setDeleteWeddingContentDialog(true);
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const ImportJSON = () => {
        setImportDialog(true);
    };

    const handleJsonUpload = async (file: File) => {
        try {
            const fileContent = await file.text();
            const weddingContent: Demo.wedding = JSON.parse(fileContent);

            const { _id, ...weddingWithoutId } = weddingContent;
            await createWedding(weddingWithoutId);
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Successfully created wedding content',
                life: 3000
            });
            const updatedWeddingContents = await getAllWeddingContent();
            setWeddingContents(updatedWeddingContents);
        } catch (error) {
            console.error(error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to upload wedding content',
                life: 3000
            });
        } finally {
            setImportDialog(false);
        }
    };

    const confirmDeleteSelected = () => {
        toast.current?.show({
            severity: 'info',
            summary: 'Info',
            detail: 'multiple delete is being development hehe :)',
            life: 3000
        });
        //setDeleteWeddingContentsDialog(true);
    };

    const deleteSelectedWeddingContents = () => {
        let _weddingcontents = (weddingContents as any)?.filter((val: any) => !(selectedWeddingContents as any)?.includes(val));
        setWeddingContents(_weddingcontents);
        setDeleteWeddingContentsDialog(false);
        setSelectedWeddingContents(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Wedding Contents Deleted',
            life: 3000
        });
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };

        // @ts-ignore
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, path: string) => {
        const val = e.target.value;
        let _weddingContent = { ...weddingContent };

        // Navigasi properti menggunakan path dinamis
        set(_weddingContent, path, val);

        setWeddingContent(_weddingContent);
    };

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    const timeInputValidator = (inputValue: any) => {
        if (!timeRegex.test(inputValue)) {
            // Set error state
            setIsInvalid(true);
            setErrorMessage('Please enter a valid time in HH:MM format.');
        } else {
            return inputValue;
        }
    };

    const onChangeAkadTime = (e: any) => {
        const inputValue = timeInputValidator(e.value);
        setIsInvalid(false);
        setErrorMessage('');
        setWeddingContent((prev) => ({
            ...prev,
            akad: {
                ...prev.akad,
                time: inputValue
            }
        }));
    };

    const onChangeResepsiTime = (e: any) => {
        const inputValue = timeInputValidator(e.value);
        setIsInvalid(false);
        setErrorMessage('');
        setWeddingContent((prev) => ({
            ...prev,
            resepsi: {
                ...prev.resepsi,
                time: inputValue
            }
        }));
    };

    const saveWeddingContent = async () => {
        setSubmitted(true);
        // Validation logic
        if (!weddingContent.groom || !weddingContent.bride || !weddingContent.category || !weddingContent.akad || !weddingContent.resepsi || !weddingContent.quotes) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please fill in all required fields.',
                life: 3000
            });
            return; // Stop execution if validation fails
        }

        setIsLoading(true);

        try {
            if (weddingContent._id) {
                await updateWedding(weddingContent._id, weddingContent);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'success to update',
                    life: 3000
                });
            } else {
                // Exclude `_id` when creating a new wedding
                const { _id, ...weddingWithoutId } = weddingContent;
                await createWedding(weddingWithoutId);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'success to create',
                    life: 3000
                });
            }
            const updatedWeddingContents = await getAllWeddingContent();
            setWeddingContents(updatedWeddingContents);
        } catch (err: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'error',
                detail: 'Failed to save',
                life: 3000
            });
            setWeddingContents(null);
        } finally {
            setIsLoading(false);
            setWeddingContentDialog(false);
            if (submitted) {
                setWeddingContent(emptyWeddingContent); // Reset form only if successfully submitted
            }
        }
    };

    const launchWeddingContent = async () => {
        try {
            await launchWedding(weddingContent._id);
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'success to launch',
                life: 3000
            });
            const updatedWeddingContents = await getAllWeddingContent();
            setWeddingContents(updatedWeddingContents);
        } catch (err: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'error',
                detail: 'Failed to launch',
                life: 3000
            });
            setWeddingContents(null);
        } finally {
            setIsLoading(false);
            setWeddingContentDialog(false);
            setWeddingContent(emptyWeddingContent);
        }
    };

    //#endregion

    //#region component
    const weddingContentDialogFooter = (
        <>
            <div className="mt-3">
                <Button label="Cancel" severity="secondary" icon="pi pi-times" onClick={hideDialog} outlined />
                {isViewMode ? (
                    <Button label="Launch" disabled={weddingContent.isActive} icon="pi pi-cloud-upload" severity="success" onClick={launchWeddingContent} outlined />
                ) : (
                    <Button label="Save" severity="success" icon="pi pi-check" onClick={saveWeddingContent} outlined />
                )}
            </div>
        </>
    );

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} outlined />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedWeddingContents || !(selectedWeddingContents as any).length} outlined />
                    <Button className="ml-2" label="Import" icon="pi pi-download" severity="info" onClick={ImportJSON} outlined />
                    <Button className="ml-2" label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} outlined />
                </div>
            </React.Fragment>
            <span>
                <div className="block mt-2 md:mt-0 p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search..." />
                    <Dropdown className="ml-2" value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={dropdownValues} optionLabel="name" showClear placeholder="Select category" />
                </div>
            </span>
        </div>
    );

    const idBodyTemplate = (rowData: Demo.wedding) => {
        return (
            <>
                <span className="p-column-title">id</span>
                {rowData._id}
            </>
        );
    };
    const pathBodyTemplate = (rowData: Demo.wedding) => {
        return (
            <>
                <span className="p-column-title">Path</span>
                {rowData.path}
            </>
        );
    };

    const categoryBodyTemplate = (rowData: Demo.wedding) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.category}
            </>
        );
    };

    const akadDateBodyTemplate = (rowData: Demo.wedding) => {
        return (
            <>
                <span className="p-column-title">Akad Date</span>
                {rowData.akad.date}
            </>
        );
    };

    const statusBodyTemplate = (rowData: Demo.wedding) => {
        const today = new Date();
        const akadDate = new Date(rowData.akad.date);

        const diffTime = today.getTime() - akadDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        let statusValue = '';
        let severity = 0;

        if (rowData.isActive) {
            if (diffDays === 0) {
                // Hari H pernikahan
                statusValue = 'Wedding Day';
                severity = 4;
            } else if (diffDays >= 30) {
                // 30 hari setelah pernikahan
                statusValue = '30 Days Post-Wedding';
                severity = 3;
            } else if (diffDays >= 1) {
                // Hari setelah pernikahan
                statusValue = 'Post-Wedding Day';
                severity = 2;
            } else {
                statusValue = 'Launched';
                severity = 1;
            }
        } else {
            statusValue = 'Ready to launch';
        }

        return (
            <>
                <span className="p-column-title">Status</span>
                <Tag value={statusValue} severity={getSeverity(severity)}></Tag>
                {/* <Badge value={statusValue} severity={severity}></Badge> */}
            </>
        );
    };

    const getSeverity = (code: number) => {
        switch (code) {
            case 1:
                return 'success';

            case 2:
                return 'warning';

            case 3:
                return 'danger';

            case 4:
                return 'info';

            default:
                return null;
        }
    };

    const actionBodyTemplate = (rowData: Demo.wedding) => {
        return (
            <>
                <Button icon="pi pi-external-link" severity="help" rounded text />
                <Button icon="pi pi-eye" severity="info" onClick={() => viewWeddingContent(rowData)} rounded text />
                <Button icon="pi pi-pencil" severity="success" onClick={() => editWeddingContent(rowData)} rounded text />
                <Button icon="pi pi-trash" severity="danger" onClick={() => confirmDeleteWeddingContent(rowData)} rounded text />
            </>
        );
    };

    const deleteWeddingContentDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteWeddingContentDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteWeddingContent} />
        </>
    );
    const deleteWeddingContentsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteWeddingContentsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedWeddingContents} />
        </>
    );

    const legendTemplate = (label: string) => (
        <div className="flex align-items-center">
            <span className="text-base ">{label}</span>
        </div>
    );

    const legendTemplateWithSwitch = (label: string) => (
        <div className="flex align-items-center">
            <span className="text-base ">{label}</span>
            <InputSwitch
                className="ml-3"
                checked={weddingContent.loveStory.loveStoryActived}
                disabled={isViewMode}
                onChange={(e) => {
                    setDisableLoveStory(!e.value); // Disable if e.value is false
                    setWeddingContent((prev) => ({
                        ...prev,
                        loveStory: {
                            ...prev.loveStory,
                            loveStoryActived: e.value
                        }
                    }));
                }}
            />
        </div>
    );

    //#endregion

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <div className="grid">
                        <div className="col-12">
                            <h5>Manage Wedding Content</h5>
                        </div>
                    </div>
                    <DataTable
                        ref={dt}
                        value={weddingContents}
                        selection={selectedWeddingContents}
                        onSelectionChange={(e) => setSelectedWeddingContents(e.value as any)}
                        dataKey="id"
                        paginator
                        showGridlines
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} wedding contents"
                        globalFilterFields={['path', 'category']}
                        filters={filters}
                        onFilter={(e) => setFilters(e.filters)}
                        emptyMessage="No weddingcontents found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column hidden field="id" header="Id" sortable body={idBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="path" header="path" sortable body={pathBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="category" header="Category" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="akadDate" header="Akad Date" sortable body={akadDateBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="status" header="Status" body={statusBodyTemplate} headerStyle={{ minWidth: '7rem' }}></Column>
                        <Column header="Action" body={actionBodyTemplate} bodyClassName="text-center" alignHeader={'center'} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={weddingContentDialog} style={{ width: '900px' }} header="Content Details" modal className="p-fluid" footer={weddingContentDialogFooter} onHide={hideDialog}>
                        <div className="grid">
                            <div className="col-12">
                                <div className="card">
                                    <div className="formgrid grid">
                                        <div className="field col">
                                            <label htmlFor="path">Path</label>
                                            <InputText id="path" value={(weddingContent.groom.shortName + '-' + weddingContent.bride.shortName).toLocaleLowerCase()} disabled={true} />
                                        </div>
                                        <div className="field col">
                                            <label htmlFor="category">Category</label>
                                            <Dropdown
                                                value={weddingContent.category}
                                                disabled={isViewMode}
                                                onChange={(e) => setWeddingContent({ ...weddingContent, category: e.value })}
                                                options={dropdownValues}
                                                required
                                                optionLabel="name"
                                                optionValue="code"
                                                placeholder="Select category"
                                                className={submitted && !weddingContent.category ? 'p-invalid' : ''}
                                            />
                                            <small className="p-error">{submitted && !weddingContent.category ? 'Category is required.' : ''}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 md:col-6">
                                <Fieldset legend={legendTemplate('Groom')} toggleable>
                                    <div className="field">
                                        <label htmlFor="shortName">Short Name</label>
                                        <InputText
                                            id="shortName"
                                            value={weddingContent.groom.shortName}
                                            disabled={isViewMode}
                                            onChange={(e) => onInputChange(e, 'groom.shortName')}
                                            required
                                            autoFocus
                                            className={submitted && !weddingContent.groom.shortName ? 'p-invalid' : ''}
                                        />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="fullName">Full Name</label>
                                        <InputText
                                            id="fullName"
                                            value={weddingContent.groom.fullName}
                                            disabled={isViewMode}
                                            onChange={(e) => onInputChange(e, 'groom.fullName')}
                                            required
                                            className={classNames({
                                                'p-invalid': submitted && !weddingContent.groom.fullName
                                            })}
                                        />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="fullNameWithTitle">Full Name with Title</label>
                                        <InputText
                                            id="fullNameWithTitle"
                                            value={weddingContent.groom.fullNameWithTitle}
                                            disabled={isViewMode}
                                            onChange={(e) => onInputChange(e, 'groom.fullNameWithTitle')}
                                            required
                                            className={classNames({
                                                'p-invalid': submitted && !weddingContent.groom.fullNameWithTitle
                                            })}
                                        />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="fatherName">Father&apos;s Name</label>
                                        <InputText
                                            id="fatherName"
                                            value={weddingContent.groom.fatherName}
                                            disabled={isViewMode}
                                            onChange={(e) => onInputChange(e, 'groom.fatherName')}
                                            required
                                            className={classNames({
                                                'p-invalid': submitted && !weddingContent.groom.fatherName
                                            })}
                                        />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="motherName">Mother&apos;s Name</label>
                                        <InputText
                                            id="motherName"
                                            value={weddingContent.groom.motherName}
                                            disabled={isViewMode}
                                            onChange={(e) => onInputChange(e, 'groom.motherName')}
                                            required
                                            className={classNames({
                                                'p-invalid': submitted && !weddingContent.groom.motherName
                                            })}
                                        />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="orderInFamily">Order in Family</label>
                                        <InputText
                                            id="orderInFamily"
                                            value={weddingContent.groom.orderInFamily}
                                            disabled={isViewMode}
                                            onChange={(e) => onInputChange(e, 'groom.orderInFamily')}
                                            required
                                            className={classNames({
                                                'p-invalid': submitted && !weddingContent.groom.orderInFamily
                                            })}
                                        />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="instagram">Instagram</label>
                                        <InputText id="instagram" value={weddingContent.groom.instagram} disabled={isViewMode} onChange={(e) => onInputChange(e, 'groom.instagram')} />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="bank">Bank</label>
                                        <InputText id="bank" value={weddingContent.groom.bank} disabled={isViewMode} onChange={(e) => onInputChange(e, 'groom.bank')} />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="noRek">Rekening Bank</label>
                                        <InputText id="noRek" keyfilter="int" value={weddingContent.groom.noRek} disabled={isViewMode} onChange={(e) => onInputChange(e, 'groom.noRek')} />
                                    </div>
                                </Fieldset>
                            </div>

                            <div className="col-12 md:col-6">
                                <Fieldset legend={legendTemplate('Bridge')} toggleable>
                                    <div className="field">
                                        <label htmlFor="shortName">Short Name</label>
                                        <InputText
                                            id="shortName"
                                            value={weddingContent.bride.shortName}
                                            disabled={isViewMode}
                                            onChange={(e) => onInputChange(e, 'bride.shortName')}
                                            required
                                            autoFocus
                                            className={classNames({
                                                'p-invalid': submitted && !weddingContent.bride.shortName
                                            })}
                                        />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="fullName">Full Name</label>
                                        <InputText
                                            id="fullName"
                                            value={weddingContent.bride.fullName}
                                            disabled={isViewMode}
                                            onChange={(e) => onInputChange(e, 'bride.fullName')}
                                            required
                                            className={classNames({
                                                'p-invalid': submitted && !weddingContent.bride.fullName
                                            })}
                                        />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="fullNameWithTitle">Full Name with Title</label>
                                        <InputText
                                            id="fullNameWithTitle"
                                            value={weddingContent.bride.fullNameWithTitle}
                                            disabled={isViewMode}
                                            onChange={(e) => onInputChange(e, 'bride.fullNameWithTitle')}
                                            required
                                            className={classNames({
                                                'p-invalid': submitted && !weddingContent.bride.fullNameWithTitle
                                            })}
                                        />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="fatherName">Father&apos;s Name</label>
                                        <InputText
                                            id="fatherName"
                                            value={weddingContent.bride.fatherName}
                                            disabled={isViewMode}
                                            onChange={(e) => onInputChange(e, 'bride.fatherName')}
                                            required
                                            className={classNames({
                                                'p-invalid': submitted && !weddingContent.bride.fatherName
                                            })}
                                        />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="motherName">Mother&apos;s Name</label>
                                        <InputText
                                            id="motherName"
                                            value={weddingContent.bride.motherName}
                                            disabled={isViewMode}
                                            onChange={(e) => onInputChange(e, 'bride.motherName')}
                                            required
                                            className={classNames({
                                                'p-invalid': submitted && !weddingContent.bride.motherName
                                            })}
                                        />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="orderInFamily">Order in Family</label>
                                        <InputText
                                            id="orderInFamily"
                                            value={weddingContent.bride.orderInFamily}
                                            disabled={isViewMode}
                                            onChange={(e) => onInputChange(e, 'bride.orderInFamily')}
                                            required
                                            className={classNames({
                                                'p-invalid': submitted && !weddingContent.bride.orderInFamily
                                            })}
                                        />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="instagram">Instagram</label>
                                        <InputText id="instagram" value={weddingContent.bride.instagram} disabled={isViewMode} onChange={(e) => onInputChange(e, 'bride.instagram')} />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="bank">Bank</label>
                                        <InputText id="bank" value={weddingContent.bride.bank} disabled={isViewMode} onChange={(e) => onInputChange(e, 'bride.bank')} />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="noRek">Rekening Bank</label>
                                        <InputText id="noRek" keyfilter="int" value={weddingContent.bride.noRek} disabled={isViewMode} onChange={(e) => onInputChange(e, 'bride.noRek')} />
                                    </div>
                                </Fieldset>
                            </div>

                            <div className="col-12">
                                <Fieldset legend={legendTemplate('Akad')} toggleable>
                                    <div className="formgrid grid">
                                        <div className="field col">
                                            <label htmlFor="akadTime">Time</label>
                                            <InputMask value={weddingContent.akad.time} onChange={onChangeAkadTime} required mask="99:99" placeholder="00:00" className={isInvalid ? 'p-invalid' : ''} aria-describedby="akad-time-help" />
                                            {isInvalid && (
                                                <small id="akad-time-help" className="p-error">
                                                    {errorMessage}
                                                </small>
                                            )}
                                        </div>
                                        <div className="field col">
                                            <label htmlFor="Akaddate">Date</label>
                                            <Calendar
                                                value={weddingContent.akad.date ? new Date(weddingContent.akad.date) : null} // Convert string to Date object
                                                onChange={(e) => {
                                                    const selectedAkadDate =
                                                        e.value instanceof Date
                                                            ? e.value.toISOString().split('T')[0] // Format as YYYY-MM-DD
                                                            : '';
                                                    setWeddingContent((prev) => ({
                                                        ...prev,
                                                        akad: {
                                                            ...prev.akad,
                                                            date: selectedAkadDate
                                                        }
                                                    }));
                                                }}
                                                showIcon
                                                className={classNames({
                                                    'p-invalid': submitted && !weddingContent.akad.date
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label htmlFor="AkadPlace">Akad Place</label>
                                        <InputTextarea
                                            id="AkadPlace"
                                            value={weddingContent.akad.place}
                                            disabled={isViewMode}
                                            onChange={(e) => onInputChange(e, 'akad.place')}
                                            required
                                            rows={3}
                                            cols={20}
                                            className={classNames({
                                                'p-invalid': submitted && !weddingContent.akad.place
                                            })}
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="liveLink">Live Akad Link</label>
                                        <InputText id="liveLink" value={weddingContent.akad.liveLink} disabled={isViewMode} onChange={(e) => onInputChange(e, 'akad.liveLink')} />
                                    </div>
                                </Fieldset>
                            </div>

                            <div className="col-12">
                                <Fieldset legend={legendTemplate('Resepsi')} toggleable>
                                    <div className="formgrid grid">
                                        <div className="field col">
                                            <label htmlFor="ResepsiTime">Time</label>
                                            <InputMask value={weddingContent.resepsi.time} onChange={onChangeResepsiTime} required mask="99:99" placeholder="00:00" className={isInvalid ? 'p-invalid' : ''} aria-describedby="resepsi-time-help" />
                                            {isInvalid && (
                                                <small id="resepsi-time-help" className="p-error">
                                                    {errorMessage}
                                                </small>
                                            )}
                                        </div>
                                        <div className="field col">
                                            <label htmlFor="ResepsiDate">Date</label>
                                            <Calendar
                                                value={weddingContent.resepsi.date ? new Date(weddingContent.resepsi.date) : null} // Convert string to Date object
                                                onChange={(e) => {
                                                    const selectedResepsiDate =
                                                        e.value instanceof Date
                                                            ? e.value.toISOString().split('T')[0] // Format as YYYY-MM-DD
                                                            : '';
                                                    setWeddingContent((prev) => ({
                                                        ...prev,
                                                        resepsi: {
                                                            ...prev.resepsi,
                                                            date: selectedResepsiDate
                                                        }
                                                    }));
                                                }}
                                                showIcon
                                                className={classNames({
                                                    'p-invalid': submitted && !weddingContent.resepsi.date
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label htmlFor="ResepsiPlace">Resepsi Place</label>
                                        <InputTextarea
                                            id="ResepsiPlace"
                                            value={weddingContent.resepsi.place}
                                            disabled={isViewMode}
                                            onChange={(e) => onInputChange(e, 'resepsi.place')}
                                            required
                                            rows={3}
                                            cols={20}
                                            className={classNames({
                                                'p-invalid': submitted && !weddingContent.resepsi.place
                                            })}
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="mapsLink">Maps Link</label>
                                        <InputText id="mapsLink" value={weddingContent.resepsi.mapsLink} disabled={isViewMode} onChange={(e) => onInputChange(e, 'resepsi.mapsLink')} />
                                    </div>
                                </Fieldset>
                            </div>

                            <div className="col-12">
                                <Fieldset legend={legendTemplate('Quote')} toggleable>
                                    <div className="field">
                                        <label htmlFor="quote1">Quote 1</label>
                                        <InputTextarea
                                            id="quote1"
                                            value={weddingContent.quotes.quote1}
                                            disabled={isViewMode}
                                            onChange={(e) => onInputChange(e, 'quotes.quote1')}
                                            required
                                            rows={3}
                                            cols={20}
                                            className={classNames({
                                                'p-invalid': submitted && !weddingContent.quotes.quote1
                                            })}
                                        />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="quote1From">Quote 1 From</label>
                                        <InputText
                                            id="quote1From"
                                            value={weddingContent.quotes.quote1From}
                                            disabled={isViewMode}
                                            onChange={(e) => onInputChange(e, 'quotes.quote1From')}
                                            required
                                            className={classNames({
                                                'p-invalid': submitted && !weddingContent.quotes.quote1From
                                            })}
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="quote2">Quote 2</label>
                                        <InputTextarea id="quote2" value={weddingContent.quotes.quote2} disabled={isViewMode} onChange={(e) => onInputChange(e, 'quotes.quote2')} rows={3} cols={20} />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="quote2From">Quote 2 From</label>
                                        <InputText id="quote2From" value={weddingContent.quotes.quote2From} disabled={isViewMode} onChange={(e) => onInputChange(e, 'quotes.quote2From')} />
                                    </div>
                                </Fieldset>
                            </div>

                            <div className="col-12">
                                <Fieldset legend={legendTemplateWithSwitch('Love Story')}>
                                    <div className="field">
                                        <label htmlFor="firstMeet">First Meet</label>
                                        <InputTextarea id="firstMeet" value={weddingContent.loveStory.firstMeet} disabled={disableLoveStory} onChange={(e) => onInputChange(e, 'loveStory.firstMeet')} rows={3} cols={20} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="theProposal">The Proposal</label>
                                        <InputTextarea id="theProposal" value={weddingContent.loveStory.theProposal} disabled={disableLoveStory} onChange={(e) => onInputChange(e, 'loveStory.theProposal')} rows={3} cols={20} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="marriage">marriage</label>
                                        <InputTextarea id="marriage" value={weddingContent.loveStory.marriage} disabled={disableLoveStory} onChange={(e) => onInputChange(e, 'loveStory.marriage')} rows={3} cols={20} />
                                    </div>
                                </Fieldset>
                            </div>
                            <div className="col-12">
                                <Fieldset legend={legendTemplate('Image Upload')} toggleable>
                                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center mt-2">
                                        <div className="my-2">
                                            <label htmlFor="marriage">Groom Image {weddingContent.imageUrl.groomImg && <i className="pi pi-check" style={{ color: 'green' }} />}</label>
                                        </div>

                                        <span>
                                            <div>
                                                <Button disabled={isViewMode} className="ml-2" label="Upload" icon="pi pi-download" severity="info" onClick={() => UploadImageHandler('groomImg')} outlined />
                                            </div>
                                        </span>
                                    </div>
                                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center mt-2">
                                        <div className="my-2">
                                            <label htmlFor="marriage">Bride Image{weddingContent.imageUrl.brideImg && <i className="pi pi-check" style={{ color: 'green' }} />}</label>
                                        </div>
                                        <span>
                                            <div>
                                                <Button disabled={isViewMode} className="ml-2" label="Upload" icon="pi pi-download" severity="info" onClick={() => UploadImageHandler('brideImg')} outlined />
                                            </div>
                                        </span>
                                    </div>
                                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center mt-2">
                                        <div className="my-2">
                                            <label htmlFor="marriage">Header Image {weddingContent.imageUrl.headerImg && <i className="pi pi-check" style={{ color: 'green' }} />}</label>
                                        </div>
                                        <span>
                                            <div>
                                                <Button disabled={isViewMode} className="ml-2" label="Upload" icon="pi pi-download" severity="info" onClick={() => UploadImageHandler('headerImg')} outlined />
                                            </div>
                                        </span>
                                    </div>
                                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center mt-2">
                                        <div className="my-2">
                                            <label htmlFor="marriage">Hero Image {weddingContent.imageUrl.heroImg && <i className="pi pi-check" style={{ color: 'green' }} />}</label>
                                        </div>
                                        <span>
                                            <div>
                                                <Button disabled={isViewMode} className="ml-2" label="Upload" icon="pi pi-download" severity="info" onClick={() => UploadImageHandler('heroImg')} outlined />
                                            </div>
                                        </span>
                                    </div>
                                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center mt-2">
                                        <div className="my-2">
                                            <label htmlFor="marriage">Event Image {weddingContent.imageUrl.eventImg && <i className="pi pi-check" style={{ color: 'green' }} />}</label>
                                        </div>
                                        <span>
                                            <div>
                                                <Button disabled={isViewMode} className="ml-2" label="Upload" icon="pi pi-download" severity="info" onClick={() => UploadImageHandler('eventImg')} outlined />
                                            </div>
                                        </span>
                                    </div>
                                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center mt-2">
                                        <div className="my-2">
                                            <label htmlFor="marriage">quote Image {weddingContent.imageUrl.quoteImg && <i className="pi pi-check" style={{ color: 'green' }} />}</label>
                                        </div>
                                        <span>
                                            <div>
                                                <Button disabled={isViewMode} className="ml-2" label="Upload" icon="pi pi-download" severity="info" onClick={() => UploadImageHandler('quoteImg')} outlined />
                                            </div>
                                        </span>
                                    </div>
                                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center mt-2">
                                        <div className="my-2">
                                            <label htmlFor="marriage">Love stroy Image {weddingContent.imageUrl.loveStoryImg && <i className="pi pi-check" style={{ color: 'green' }} />}</label>
                                        </div>
                                        <span>
                                            <div>
                                                <Button disabled={isViewMode} className="ml-2" label="Upload" icon="pi pi-download" severity="info" onClick={() => UploadImageHandler('loveStoryImg')} outlined />
                                            </div>
                                        </span>
                                    </div>
                                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center mt-2">
                                        <div className="my-2">
                                            <label htmlFor="marriage">gift Image {weddingContent.imageUrl.giftImg && <i className="pi pi-check" style={{ color: 'green' }} />}</label>
                                        </div>
                                        <span>
                                            <div>
                                                <Button disabled={isViewMode} className="ml-2" label="Upload" icon="pi pi-download" severity="info" onClick={() => UploadImageHandler('giftImg')} outlined />
                                            </div>
                                        </span>
                                    </div>
                                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center mt-2">
                                        <div className="my-2">
                                            <label htmlFor="marriage">rsvp Image {weddingContent.imageUrl.rsvpImg && <i className="pi pi-check" style={{ color: 'green' }} />}</label>
                                        </div>
                                        <span>
                                            <div>
                                                <Button disabled={isViewMode} className="ml-2" label="Upload" icon="pi pi-download" severity="info" onClick={() => UploadImageHandler('rsvpImg')} outlined />
                                            </div>
                                        </span>
                                    </div>
                                    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center mt-2">
                                        <div className="my-2">
                                            <label htmlFor="marriage">footer Image {weddingContent.imageUrl.footerImg && <i className="pi pi-check" style={{ color: 'green' }} />}</label>
                                        </div>
                                        <span>
                                            <div>
                                                <Button disabled={isViewMode} className="ml-2" label="Upload" icon="pi pi-download" severity="info" onClick={() => UploadImageHandler('footerImg')} outlined />
                                            </div>
                                        </span>
                                    </div>
                                </Fieldset>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteWeddingContentDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteWeddingContentDialogFooter} onHide={hideDeleteWeddingContentDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {weddingContent && (
                                <span>
                                    Are you sure you want to delete <b>{weddingContent.path}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteWeddingContentsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteWeddingContentsDialogFooter} onHide={hideDeleteWeddingContentsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {weddingContent && <span>Are you sure you want to delete the selected weddingcontents?</span>}
                        </div>
                    </Dialog>

                    <Dialog
                        visible={imageDialog}
                        modal
                        header={`Upload ${imageName.slice(0, -3)} image`}
                        footer={false}
                        style={{ width: '50rem' }}
                        onHide={() => {
                            if (!imageDialog) return;
                            setImageDialog(false);
                        }}
                    >
                        <FileUpload
                            name="demo[]"
                            accept="image/*"
                            customUpload
                            multiple={false}
                            maxFileSize={1000000}
                            uploadHandler={(event) => {
                                const file = event.files[0];
                                onUploadHandler(file);
                            }}
                            emptyTemplate={<p className="m-0">Drag and drop image here to upload.</p>}
                        />
                    </Dialog>

                    <Dialog
                        visible={importDialog}
                        modal
                        header="Import Wedding Content"
                        footer={false}
                        style={{ width: '50rem' }}
                        onHide={() => {
                            if (!importDialog) return;
                            setImportDialog(false);
                        }}
                    >
                        <FileUpload
                            name="demo[]"
                            accept="application/json"
                            customUpload
                            multiple={false}
                            maxFileSize={1000000}
                            uploadHandler={(event) => {
                                const file = event.files[0];
                                handleJsonUpload(file);
                            }}
                            emptyTemplate={<p className="m-0">Drag and drop JSON files here to upload.</p>}
                        />
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default WeddingContentPage;
