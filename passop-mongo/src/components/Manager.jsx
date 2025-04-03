import React, { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const ref = useRef();
    const passwordRef = useRef();
    const [form, setform] = useState({ site: "", username: "", password: "" });
    const [passwordArray, setpasswordArray] = useState([]);

    const getPassword = async () => {
        let req = await fetch("http://localhost:3000/");
        let passwords = await req.json();
        console.log(passwords);
        setpasswordArray(passwords);
    };

    useEffect(() => {
        getPassword();
    }, []);

    const copyText = (text) => {
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
        navigator.clipboard.writeText(text);
    };

    const showPassword = () => {
        passwordRef.current.type = "text"
        if (ref.current.src.includes("icons/eyecross.png")) {
            ref.current.src = "icons/eye.png"
            passwordRef.current.type = "password"
        }
        else {
            passwordRef.current.type = "text"
            ref.current.src = "icons/eyecross.png"
        }
    };

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            const id = uuidv4();
            const newPassword = { ...form, id };

            await fetch("http://localhost:3000/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newPassword)
            });

            setpasswordArray((prev) => [...prev, newPassword]);

            setform({ site: "", username: "", password: "" });

            toast('Password saved!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else {
            toast('Error: Password not saved! Ensure all fields are filled.');
        }
    };

    const deletePassword = async (id) => {
        const confirmDelete = window.confirm("Do you really want to delete this password?");
        if (confirmDelete) {
            setpasswordArray(passwordArray.filter(item => item.id !== id));

            await fetch("http://localhost:3000/", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id })
            });

            toast('Password Deleted!', {
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
    };

    const editPassword = (id) => {
        setform({ ...passwordArray.find(i => i.id === id), id });
        setpasswordArray(passwordArray.filter(item => item.id !== id));
    };

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value });
    };

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
            <div className='p:2 pt-3 md:mycontainer min-h-[89vh]'>
                <h1 className='text-4xl text font-bold text-center'><span className='text-fuchsia-900'>&lt;</span>
                    Pass
                    <span className='text-fuchsia-900'>OP/&gt;</span></h1>
                <p className='text-fuchsia-900 text-lg text-center '>Your own password manager</p>

                <div className='text-black flex flex-col gap-5 m-5 items-center'>
                    <input value={form.site} onChange={handleChange} placeholder='Enter website URL' className='rounded-full border border-fuchsia-700 w-full p-4 py-1' type="text" name="site" id="site" />
                    <div className='flex flex-col md:flex-row w-full justify-between gap-3'>
                        <input value={form.username} onChange={handleChange} placeholder='Enter username' className='rounded-full border border-fuchsia-700 w-full p-4 py-1' type="text" name='username' id='username' />
                        <div className="relative">
                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter password' className='rounded-full border border-fuchsia-700 w-full p-4 py-1' type="password" name='password' id='password' />
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
                    {passwordArray.length !== 0 && <table className="table-auto w-full rounded-md overflow-hidden mb-10">
                        <thead className=' bg-fuchsia-800 text-white '>
                            <tr>
                                <th className='py-2'>Site</th>
                                <th className='py-2'>Username</th>
                                <th className='py-2'>Password</th>
                                <th className='py-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='bg-fuchsia-100'>
                            {passwordArray.map((item, index) => {
                                return <tr key={index}>
                                    <td className='py-3 border-white text-center'>
                                        <div className="flex items-center justify-center">
                                            <a href={item.site} target='_blank'>{item.site}</a>
                                            <div className='lordiconcopy size-7 cursor-pointer ' onClick={() => { copyText(item.site) }}><lord-icon
                                                style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                src="https://cdn.lordicon.com/depeqmsz.json"
                                                trigger="hover">
                                            </lord-icon></div>
                                        </div>
                                    </td>
                                    <td className='py-3 border-white text-center'>
                                        <div className="flex items-center justify-center">
                                            <span>{item.username}</span>
                                            <div className='lordiconcopy size-7 cursor-pointer ' onClick={() => { copyText(item.username) }}><lord-icon
                                                style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                src="https://cdn.lordicon.com/depeqmsz.json"
                                                trigger="hover">
                                            </lord-icon></div>
                                        </div>
                                    </td>
                                    <td className='py-3 border-white text-center'>
                                        <div className="flex items-center justify-center">
                                            <span>{item.password}</span>
                                            <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.password) }}><lord-icon
                                                style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                src="https://cdn.lordicon.com/depeqmsz.json"
                                                trigger="hover">
                                            </lord-icon></div></div>
                                    </td>

                                    <td className='justify-center py-3 border-white text-center'>
                                        <span className='cursor-pointer mx-1' onClick={() => { editPassword(item.id) }}><lord-icon
                                            src="https://cdn.lordicon.com/fikcyfpp.json"
                                            trigger="hover"
                                            colors="primary:#121331,secondary:#000000"
                                            style={{ "width": "25px", "height": "25px" }}></lord-icon></span>

                                        <span className='cursor-pointer mx-1' onClick={() => { deletePassword(item.id) }}><lord-icon
                                            src="https://cdn.lordicon.com/skkahier.json"
                                            trigger="hover"
                                            style={{ "width": "25px", "height": "25px" }}></lord-icon></span>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>}
                </div>
            </div>
        </>
    );
};

export default Manager;
