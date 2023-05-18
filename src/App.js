import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";    
import 'primeicons/primeicons.css';

function App() {

  let emptyProduct = {
    id: null,
    name: '',
    image: null,
    description: '',
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    inventoryStatus: 'INSTOCK'
};

const [products, setProducts] = useState(null);
const [productDialog, setProductDialog] = useState(false);
const [deleteProductDialog, setDeleteProductDialog] = useState(false);
const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
const [product, setProduct] = useState(emptyProduct);
const [selectedProducts, setSelectedProducts] = useState(null);
const [submitted, setSubmitted] = useState(false);
const [globalFilter, setGlobalFilter] = useState(null);
const toast = useRef(null);
const dt = useRef(null);

useEffect(() => {

  let pokemons = [];

  let pokemon1 = {
    code: 1,
    name: 'Picachu',
    type: 'Eletrico',
  };

  let pokemon2 = {
    code: 2,
    name: 'Squirtle',
    type: 'Agua',
  };

  let pokemon3 = {
    code: 3,
    name: 'Bulbassauro',
    type: 'Planta',
  };
  
  let pokemon4 = {
    code: 4,
    name: 'Charmander',
    type: 'Fogo',
  };

  pokemons.push(pokemon1);
  pokemons.push(pokemon2);
  pokemons.push(pokemon3);
  pokemons.push(pokemon4);

  setProducts([])
  setProducts(pokemons)

    // ProductService.getProducts().then((data) => setProducts(data));
}, []);

const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
};

const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
};

const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
};

const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
};

const saveProduct = () => {
    setSubmitted(true);

    if (product.name.trim()) {
        let _products = [...products];
        let _product = { ...product };

        if (product.id) {
            const index = findIndexById(product.id);

            _products[index] = _product;
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        } else {
            _product.id = createId();
            _product.image = 'product-placeholder.svg';
            _products.push(_product);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        }

        setProducts(_products);
        setProductDialog(false);
        setProduct(emptyProduct);
    }
};

const editProduct = (product) => {
    setProduct({ ...product });
    setProductDialog(true);
};

const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
};

const deleteProduct = () => {
    let _products = products.filter((val) => val.id !== product.id);

    setProducts(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};

const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
};

const createId = () => {
    let id = '';
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return id;
};

const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
};

const deleteSelectedProducts = () => {
    let _products = products.filter((val) => !selectedProducts.includes(val));

    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
};

const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _product = { ...product };

    _product[`${name}`] = val;

    setProduct(_product);
};

const leftToolbarTemplate = () => {
    return (
        <div className="flex flex-wrap gap-2">
            <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
            <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
        </div>
    );
};

const imageBodyTemplate = (rowData) => {
    let codeIMG = rowData.code;    
    let imgSRC = codeIMG + ".gif";

    return <img src={imgSRC} alt={rowData.image} className="shadow-2 border-round" style={{ width: '64px' }} />;
};

const actionBodyTemplate = (rowData) => {
    return (
        <React.Fragment>
            <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
        </React.Fragment>
    );
};

const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
        <h4 className="m-0">Consultar Pokemon</h4>
        <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
        </span>
    </div>
);
const productDialogFooter = (
    <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
    </React.Fragment>
);
const deleteProductDialogFooter = (
    <React.Fragment>
        <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
        <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
    </React.Fragment>
);
const deleteProductsDialogFooter = (
    <React.Fragment>
        <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
        <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
    </React.Fragment>
);

  return (
    <div className="App">
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} ></Toolbar>

                <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="code" header="Code" sortable style={{ minWidth: '5rem' }}></Column>
                    <Column field="image" header="Image" body={imageBodyTemplate}></Column>
                    <Column field="name" header="Name" sortable style={{ minWidth: '5rem' }}></Column>
                    <Column field="type" header="Tipo" sortable style={{ minWidth: '5rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Name
                    </label>
                    <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                    {submitted && !product.name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="type" className="font-bold">
                        Tipo
                    </label>
                    <InputTextarea id="type" value={product.type} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                </div>
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">                    
                    {product && (
                        <span>
                            Are you sure you want to delete <b>{product.name}</b>?
                        </span>
                    )}
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">                    
                    {product && <span>Are you sure you want to delete the selected products?</span>}
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                </div>
            </Dialog>
        </div>  
  );

}
export default App;
