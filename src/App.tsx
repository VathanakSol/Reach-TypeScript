import { useState } from 'react'
import './App.css'
import { Spinner } from 'flowbite-react'
import { useEffect } from 'react'
import { Button, Modal} from 'flowbite-react'
import CardComponent from './components/CardComponent'
import FormCreateProduct from './components/FormCreateProduct'

type Status = 'idle' | 'loading' | 'success' | 'error'
type Product = {
  readonly id: number,
  title: string,
  price: number,
  description: string,
  category: string,
  image: string
}

function App() {
  // const [count, setCount] = useState(0)
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [openModal, setOpenModal] = useState(false);
  const [dataForm, setDataForm] = useState({});

  useEffect(()=>{
    // console.log("Component mounted")
    // document.title = "rendered: " + count
    setStatus('loading')
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data =>{
        setProducts(data)
        setStatus("success")
      }).catch(err => {
        setStatus("error")
    })
  },[])

  if(status === "loading"){
    return(
      // <div className='h-screen grid place-content-center'>
      //   <h1 className="text-6xl">Loading</h1>
      // </div>
      <div className="grid place-content-center h-screen">
        <Spinner aria-label="Center-aligned spinner example" />
      </div>
    )
  }

  function getDataForm(product:any){
    setDataForm(product);
  }
  
  const createProduct = () => {
    fetch("https://fakestoreapi.com/products",{
      method: "POST",
      body: JSON.stringify(dataForm),
      headers: {
        "Content-type": "application/json;",
      },
    })
    .then((res)=>res.json())
    .then((data)=>{
      console.log("Create product Success")
      console.log(data);
    })
    .catch((err)=>{
      console.log(err);
    });
    setOpenModal(false);
  }

  return (
    <>
     <div className="my-6 flex justify-center">
      <Button onClick={()=> setOpenModal(true)}>Create Product</Button>
     </div>

     <div className="mx-16 grid grid-flow grid-cols-4 gap-4">
      {products.map((product) => 
        <CardComponent 
          key = {product.id} 
          title = {product.title} 
          image = {product.image} 
          price = {product.price} 
        />
      )}
     </div>

     <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Create Product</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
           <FormCreateProduct getDataForm={getDataForm}/>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => createProduct()}>Create</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  )
}

export default App
