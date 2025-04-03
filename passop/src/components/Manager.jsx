import React from 'react'
import { useRef,useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';


const Manager = () => {
    const ref = useRef();
    const passwordRef  = useRef();
    const [form, setform] = useState({site:"", username:"",password:""})
    const [passwordArray,setpasswordArray] = useState([])


    useEffect(() => {
        let passwords = localStorage.getItem("passwords")
        if(passwords){
            setpasswordArray(JSON.parse(passwords))
        }
        
    }, [])

    const copyText = (text)=>{
        toast('Copied to clipboard', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            
            });
         navigator.clipboard.writeText(text)
    }
    

    const showPassword = () =>{
        passwordRef.current.type = "text"
        console.log(ref.current.src)
        if(ref.current.src.includes("icons/eyecross.png")){
        ref.current.src ="icons/eye.png"
        passwordRef.current.type = "text"
    }
    else{
        ref.current.src = "icons/eyecross.png"
        passwordRef.current.type = "password"
    }
    }

    const savePassword = () =>{
        

        if(form.site.length>3 && form.username.length>3 && form.password.length>3){
            setpasswordArray([...passwordArray,{...form, id: uuidv4}])
            localStorage.setItem("passwords",JSON.stringify([...passwordArray,{...form, id: uuidv4()}]))
            console.log([...passwordArray,form])
            setform({site:"",username:"",password:""})
            toast('Password save successfully', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                
                }); 
        }
        
        else{
            toast('Password not saved');   
            
        }
    }

    const deletePassword = (id) =>{
        console.log("Deleting password with id",id)
        let c = confirm("Do you really want to delete this password")
        if(c){
            setpasswordArray(passwordArray.filter(item=>item.id!==id))
            localStorage.setItem("passwords",JSON.stringify(passwordArray.filter(item=>item.id!==id)))
            // console.log(passwordArray
            toast('Password deleted successfully', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                
                });
        }
       
    }

    const editPassword = (id) =>{
        console.log("Editing password with id",id)
        setform(passwordArray.filter(i=>i.id===id)[0])
        setpasswordArray(passwordArray.filter(item=>item.id!==id))
    }


    const handleChange = (e) =>{
        setform({...form, [e.target.name]: e.target.value})
    }


    return (
        <>
            <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick={false}
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
    
/>
<ToastContainer/>
        <div className="absolute inset-0 -z-10 h-full w-full bg-fuchsia-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-600 opacity-20 blur-[100px]"></div></div>
        <div className='p:2 pt-3 md:mycontainer min-h-[89vh]'>
            <h1 className='text-4xl text font-bold text-center'><span className='text-fuchsia-900'>&lt;</span>
            Pass
            <span className='text-fuchsia-900'>OP/&gt;</span></h1>
            <p className='text-fuchsia-900 text-lg text-center '>Your own password manager</p>

        <div className='text-black flex flex-col gap-5 m-5 items-center'>
            <input value={form.site} onChange={handleChange} placeholder='Enter website URL'className='rounded-full border border-fuchsia-700 w-full p-4 py-1' type="text" name="site" id="site"/>
            <div className='flex flex-col md:flex-row w-full justify-between gap-3'>
                <input value={form.username} onChange={handleChange} placeholder='Enter username' className='rounded-full border border-fuchsia-700 w-full p-4 py-1'type="text" name='username' id='username' />
                <div className="relative">

                <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter password' className='rounded-full border border-fuchsia-700 w-full p-4 py-1'type="password" name='password' id='password' />
                <span className="absolute right-[5px] top-[4px] cursor-pointer" onClick={showPassword}>
                <img ref={ref} className='p-1' width={26} src="icons/eye.png" alt="eye" />
                </span>
                </div>
                
            </div>
            <button onClick={savePassword} className='flex justify-center bg-fuchsia-400 px-5 py-1 rounded-full items-center w-fit hover:bg-fuchsia-700 border-2 border-fuchsia-900'>
            <lord-icon
            src="https://cdn.lordicon.com/jgnvfzqg.json"
            trigger="hover">
            </lord-icon>
          Save Password</button>
            </div>

            <div className="password">
                <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
                {passwordArray.length === 0 && <div>No passwords to show</div>}
                {passwordArray.length !=0 &&<table className="table-auto w-full rounded-md overflow-hidden mb-10">
  <thead className=' bg-fuchsia-800 text-white '>
    <tr>
      <th className='py-2'>Site</th>
      <th className='py-2'>Username</th>
      <th className='py-2'>Password</th>
      <th className='py-2'>Actions</th>
    </tr>
  </thead>
  <tbody className='bg-fuchsia-100' >
    {passwordArray.map((item,index)=>{
        return <tr key={index}>
        <td className='py-3 border-white text-center'>
            <div className="flex items-center justify-center">
            <a href={item.site} target='_blank'>{item.site}</a>

        <div className='lordiconcopy size-7 cursor-pointer ' onClick={()=>{copyText(item.site)}}><lord-icon
        style={{"width":"25px","height":"25px","paddingTop":"3px", "paddingLeft":"3px"}} 
        src="https://cdn.lordicon.com/depeqmsz.json"
        trigger="hover">
    </lord-icon></div>
    </div>
        </td>
        <td className= 'py-3 border-white text-center'>
            <div className="flex items-center justify-center">
            <span>{item.username}</span>
        <div className='lordiconcopy size-7 cursor-pointer ' onClick={()=>{copyText(item.username)}}><lord-icon
        style={{"width":"25px","height":"25px","paddingTop":"3px", "paddingLeft":"3px"}} 
        src="https://cdn.lordicon.com/depeqmsz.json"
        trigger="hover">
        </lord-icon>
        </div>
        </div>
        </td>
        <td className=' py-3 border-white text-center'>
            <div className="flex items-center justify-center">
            <span>{item.password}</span>
        <div className='lordiconcopy size-7 cursor-pointer' onClick={()=>{copyText(item.password)}}><lord-icon
        style={{"width":"25px","height":"25px","paddingTop":"3px", "paddingLeft":"3px"}} 
        src="https://cdn.lordicon.com/depeqmsz.json"
        trigger="hover">
        </lord-icon>
        </div></div>
        </td>

        <td className='justify-center py-3 border-white text-center'>
          <span className='cursor-pointer mx-1' onClick={()=>{editPassword(item.id)}}><lord-icon
            src="https://cdn.lordicon.com/fikcyfpp.json"
            trigger="hover"
            colors="primary:#121331,secondary:#000000"
            style={{"width":"25px","height":"25px"}}>
        </lord-icon></span> 

         <span className='cursor-pointer mx-1'onClick={()=>{deletePassword(item.id)}}><lord-icon
    src="https://cdn.lordicon.com/skkahier.json"
    trigger="hover"
    style={{"width":"25px","height":"25px"}}>
</lord-icon></span>  
        </td>
        </tr>
           })}
    
    
    
  </tbody>
</table>}

            </div>
        </div>
        </>

        
    )
}

export default Manager
